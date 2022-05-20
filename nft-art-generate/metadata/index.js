const fs = require('fs');
const path = require('path');

function createMetadata() {
  const generateDir = fs.mkdirSync(path.resolve(__dirname, 'generate'), { recursive: true });

  for (i = 0; i < 100; i++) {
    let name =  path.resolve(generateDir, `${i}.json`);
    let metadata = {
      "name": `Unicorn #${i}`,
      "description": "A beautiful unicorn image",
      "image": `ipfs://QmVrBv3p9DUMYinY2NWKXSqwGa1nqVUbyiR2JkD1rrtWSn/${i}.svg`,
      "attributes": [
        {
          "display_type": "date", 
          "trait_type": "birthday", 
          "value": Date.now()/1000
        },
        {
          "display_type": "number", 
          "trait_type": "Generation", 
          "value": i
        }
      ]
    }
    
    fs.writeFileSync(name, JSON.stringify(metadata, null, 2));
  } 
  console.log('Metadatas created successfully at' + generateDir);
}

createMetadata();

