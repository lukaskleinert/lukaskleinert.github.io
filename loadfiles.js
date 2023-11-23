var exampleFileCache = { 'err': "(* Could not load files! *)" };

async function readFilesInDirectory(directoryPath) {
    const response = await fetch(directoryPath);
    const files = await response.json(); // Assuming the server returns a JSON array of file names

    const fileContents = {};

    // Use Promise.all to concurrently fetch all files
    await Promise.all(
        files.map(async (file) => {
            const fileResponse = await fetch(`${directoryPath}/${file}`);
            const fileContent = await fileResponse.text();
            fileContents[file] = fileContent;
        })
    );

    return fileContents;
}

// Example usage:
const directoryPath = 'examples/';
readFilesInDirectory(directoryPath)
    .then((contents) => {
        console.log(contents);
        exampleFileCache = contents;
    })
    .catch((error) => {
        console.error(error);
    });
