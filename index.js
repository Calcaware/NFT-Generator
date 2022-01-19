#!/bin/node
// Generate Image From Layers
// Author: Calcaware

const fs = require('fs');
const path = require('path');
const images = require("images");
const config = require("./config");

const index = JSON.parse(fs.readFileSync("data/index.json").toString());
var duplicates = JSON.parse(fs.readFileSync("data/manifest.json").toString());


function reset() {
	process.stdout.write("Resetting everything...");
	fs.writeFileSync("data/manifest.json", "[]");
	process.stdout.write(".");
	fs.writeFileSync("data/index.json", "{}");
	process.stdout.write(".");
	fs.rmSync("output", { recursive: true });
	process.stdout.write(".");
	fs.mkdirSync("output");
	process.stdout.write(".");
	fs.mkdirSync("output/images");
	process.stdout.write(".");
	fs.mkdirSync("output/data");
	process.stdout.write(".");
	fs.mkdirSync("output/json");
	process.stdout.write(" Done.\n");
}


function indexing() {
	process.stdout.write("Indexing assets...");
	let index = {};
	let root = fs.readdirSync("./assets");
	for (let i = 0; i < root.length; i++)
		index[root[i]] = {};

	let categories = Object.keys(index);
	for (let i = 0; i < categories.length; i++) {
		let items = fs.readdirSync(`./assets/${categories[i]}`);
		for (let j = 0; j < items.length; j++)
			index[categories[i]][items[j]] = fs.readdirSync(`./assets/${categories[i]}/${items[j]}`);
		process.stdout.write(".");
	}

	fs.writeFileSync("data/index.json", JSON.stringify(index, null, '\t'));
	process.stdout.write(" Done.\n");
}


function convert(name, description) {
	process.stdout.write("Converting JSON files...");
	const files = fs.readdirSync("./output/data");

	for (let f = 0; f < files.length; f++) {

		const filename = files[f];
		process.stdout.write(".");

		let input = JSON.parse(fs.readFileSync(`./output/data/${filename}`));

		let keys = Object.keys(input);
		let attributes = [];
		for (let a = 0; a < keys.length; a++)
			attributes.push({
				"trait_type": keys[a],
				"value": input[keys[a]]
			});

		let output = {
			"name": name.replace(/#/g, filename.replace(".json", "")).replace("[hash]", "#"),
			"description": description.replace(/#/g, filename.replace(".json", "")).replace("[hash]", "#"),
			"image": `ipfs://png/${filename.replace("json", "png")}`,
			"date": Date.now(),
			"attributes": attributes
		};

		fs.writeFileSync(`./output/json/${filename}`, JSON.stringify(output, null, '\t'));
	}
	process.stdout.write(" Done.\n");
}


function isDuplicate(manifest) {
	for (let d = 0; d < duplicates.length; d++)
		if (JSON.stringify(duplicates[d]) == JSON.stringify(manifest))
			return true;
	return false;
}


function generateRandom(order) {
	let character = [];
	for (let o = 0; o < order.length; o++) {
		let category = order[o];
		let type = Object.keys(index[category])[Math.floor(Math.random() * Object.keys(index[category]).length)];
		let item = index[category][type][Math.floor(Math.random() * index[category][type].length)];
		character.push({ "category": category, "type": type, "item": item.replace(".png", ""), "path": `./assets/${category}/${type}/${item}` });
	}
	return character;
}


function drawRandom(character) {
	let data = {
		"image": images(character[0].path),
		"manifest": {}
	};

	data.manifest[character[0].category] = `${character[0].item} ${character[0].type}`; // Background

	data.image.draw(images(character[1].path), 0, 0); // Character
	data.manifest[character[1].category] = `${character[1].item} ${character[1].type}`;

	if (Math.random() < .25) { // 25% Chance
		data.image.draw(images(character[2].path), 0, 0); // Overlay
		data.manifest[character[2].category] = `${character[2].item} ${character[2].type}`;
	}
	
	return data;
}


function generate(start, amount) {
	
	console.log(`Generating ${amount} starting at ${start}...`);
	
	let counter = start;
	while (counter < (amount + start)) {

		let character = generateRandom(config.layers);
		let data = drawRandom(character);

		if (isDuplicate(data.manifest))
			continue;
		else
			duplicates.push(data.manifest);
			
		data.image.save(`./output/images/${counter}.png`);
		fs.writeFileSync(`./output/data/${counter}.json`, JSON.stringify(data.manifest, null, '\t'));

		counter++;
	}

	fs.writeFileSync("data/manifest.json", JSON.stringify(duplicates, null, '\t'));
	console.log("Done.");
}


(() => {
	var args = process.argv.slice(2);
	
	switch (args[0]) {

		case "-i":
		case "index":
		case "--index":
			indexing();
			break;

		case "-g":
		case "generate":
		case "--generate":
			args.shift();
			if (args.length != 2)
				return console.log("Invalid number of arguments given.")
			let start = parseInt(args[0]);
			if (isNaN(start) || start < 0)
				return console.log("Invalid start number given.")
			let amount = parseInt(args[1]);
			if (isNaN(amount) || amount < 1)
				return console.log("Invalid amount number given.")
			generate(start, amount);
			break;

		case "-c":
		case "convert":
		case "--convert":
			args.shift();
			convert(args[0], args[1]);
			break;

		case "-r":
		case "reset":
		case "--reset":
			reset();
			break;

		case "-h":
		case "help":
		case "--help":
		default:
			console.log(
`Usage: ${process.argv.slice(2)}\n
	-i	--index				Generate assets index.
	-g	--generate [start] [amount]	Generate a given number of NFTs at a starting number.
	-c	--convert "name" "description"	Convert the JSON to the format used by the bulk uploader. Use # to be replaced with the number and "[hash]" for the # character.
	-r	--reset				Delete the generated NFTs and clear the manifest.
`);
			break;

	}

})();