# NFT-Generator
A node.js program that allows you to easily generate NFTs from image layers and get the JSON for an uploader.

**The assets provided are for example only. Please do not use them to make NFTs.**

# What you should know:
Observe the file structure in the assets folder.
Under assets is categories such as Background.
Under each category is types such as Gradient, Solid, etc.
Under each type is multiple image layers of that type. Usually separated by color variations.

The file structure of the assets folder directly corresponds to the attributes of each image.
For example:
	assets/Background/Solid/Red.png
	will translate to
	Background: Solid Red
so name your files appropriately if you want attributes capitalized and with no extra spaces or symbols.

**Note:** *Make sure all image layers are the same size.
If a layer is larger than the background image then it will cause an error.*


# Usage:

Install a recent version of node.js. I'm using v16.13.1, but this should work with 12+.

Open a terminal, powershell, command prompt, etc.
Make sure you are in this directory. That can usually be accomplished with the "cd" command.

## To run use node index.js
You will get usage information so you don't have to refer to this file.

Add the images in the assets folder according to your standards.
When the images or structure in the assets folder changes run this command.
`node index.js --index`

This will create an index file for the generator to reference when combining layers.

Open the config.js file in the data folder. The layers property is a list of layers you want stacked.
Organize it how you prefer and save. Background is always the 1st layer in the list.

To generate NFTs use this command.
node index.js --generate [start] [amount]
where start is an integer that the files will be named and the amount is how many to generate.
For example:
	`node index.js --generate 1 10`
	will generate 10 NFTs with the file names 1.png, 2.png, 3.png, all the way up to 10.png
	the images will be saved in the data/images folder as PNGs.

As mentioned before all NFTs have attributes. This is stored in JSON files with the equivalent file name.
Every image named 32.png will have an equivalent 32.json file containing the attributes in the data/json folder.

After your NFTs are generated you may want to bulk upload them to a site like OpenSea.io.

Most uploaders use a specific JSON format.
To make compatible JSON for the uploaders after the NFTs are generated run this command.
	`node index.js --convert "title" "description"`
	where "title" is the title of the NFT to be uploaded and "description" is... you get the point.

For convenience I added basic variables compatible with the title and description.
To convert the JSON and use the numbers of the NFTs in the title or description you can use # and [hash]
For example:
	`node index.js --convert "NFT Title [hash]#" "NFT number # description"`
	will set the title and description for each NFT to
	NFT Title #1
	and
	NFT number 1
	respectively.


To prevent duplicate NFTs from being generated when you want to generate another batch I have added the data/manifest.json file.
The manifest.json file is never to be edited except with the use of a command.
Every time you upload your batch it is a good idea to keep a backup of manifest.json.


Once you're done with your collection or you decided to change things before you start uploading you can reset everything so you can start a new collection.
To reset everything with the exception of the contents of the assets folder (so your image editing work isn't deleted) use this command.
	`node index.js --reset`


After a reset you will have to generate the index again and so on. See above.


This was provided free of use as a project to help people who want to generate NFTs a lot easier than manually creating and writing everything down.
I'm not liable for any damages that occur as a result of making changes to your exising collections and I'm not liable for the content generated.


Like this project or want to donate?
PayPal: paypal.me/Calcaware
OpenSea.io Ethereum: 0xf3db2c8080fd49fa471bc608e7143a101b8f7bd8
CashApp: $Calcaware


Want to hire me?
Personal Website: Calcaware.com
Twitter: @Calcaware
