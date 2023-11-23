var exampleFileCache = { 'err': "(* Could not load files! *)" };

async function cacheFile(filePath) {
    fetch(filePath).then((contents) => {
        console.log(contents);
        exampleFileCache[filePath] = contents;
    }).catch((error) => {
        console.error(error);
    });
}

