var filename = ""
var edit = undefined;
var term = undefined;

function loadfile(fn) {
    window.location.hash = fn;
    dir = "examples/";
    filename = fn;
    $.ajax({
        type: "GET",
        url: dir + fn,
        dataType: 'text',
        success: function (data) { edit.setValue(data); }
    });
}

$(function () {
    // Creation of editors.
    edit = CodeMirror(document.getElementById("edit"), {
        lineNumbers: true,
        lineWrapping: true,
        theme: "solarized",
        scrollbarStyle: "simple"
    });

    edit.on('cursorActivity',
        function (instance) {
            var pos = instance.getCursor();
            $("#pos").text((pos.line + 1) + ',' + pos.ch);
        });

    term = CodeMirror(document.getElementById("term"), {
        lineWrapping: true,
        readOnly: false,
        theme: "solarized",
        scrollbarStyle: "simple"
    });

    term2 = CodeMirror(document.getElementById("term2"), {
        lineWrapping: true,
        readOnly: false,
        theme: "solarized",
        scrollbarStyle: "simple"
    });

    term3 = CodeMirror(document.getElementById("term3"), {
        lineWrapping: true,
        readOnly: false,
        theme: "solarized",
        scrollbarStyle: "simple"
    });

    // Loading default file in the editor.
    var s = location.hash.substring(1);
    if (s === "") { s = "intro.affe"; };
    loadfile(s);

    // Making things resizable.
    $("#west").resizable({
        handles: "e",
        minWidth: 400,
        maxWidth: (window.innerWidth - 400)
    });


    $("#edit").resizable({
        handles: "s",
        minHeight: 100,
        maxHeight: (window.innerHeight - 120),
        resize:
            function (event, ui) {
                $("#terms").css("height", "calc(100% - " + ui.size.height + "px - 3ex)");
                edit.refresh();
            }
    });

    console.log("Initialized jquery");
});


// var worker_handler = new Object ();

function get_term(i) {
    if (i == 1) return term;
    else if (i == 2) return term2;
    else if (i == 3) return term3;
}

function clear_term(i) {
    get_term(i).setValue('')
}

function add_to_term(i, s) {
    var doc = get_term(i).getDoc();
    var line = doc.lastLine();
    var pos = {
        line: line,
        ch: doc.getLine(line).length
        // set the character position to the end of the line
    }
    doc.replaceRange(s, pos); // adds a new line
}
function flush_term(i) {
    var t = get_term(i)
    var doc = t.getDoc();
    t.scrollIntoView(doc.getCursor());
}

// worker.onmessage =
//   function (m) {
//     if (m.data.typ != 'result') add_to_term(m.data.result);
//     else add_to_term(m.data.result);
//   }

// function ASYNCH (action_name, action_args, cont) {
//   worker_handler[action_name] = cont;
//   worker.postMessage ({fname: action_name, args: action_args});
// }

function run_ocaml() {
    clear_term(3);
    var s = term2.getValue();
    var res = OCaml.execute(s);
    add_to_term(3, res);
    flush_term(3);
}

function eval_affe() {
    var s = edit.getValue();
    Affe.eval(filename, s);
}


var exampleFileCache = { 'err': "(* Could not load file! *)" };

var builtinFileCache = { 'err': "(* Could not load file! *)" };

async function cacheFile(filePath) {
    fetch(filePath).then((contents) => {
        contents.text().then((val) => {
            exampleFileCache[filePath] = val;
        });
    }).catch((error) => {
        console.error(error);
    });
}

const builtinPath = s => `builtin/${s.charAt(0).toLowerCase()}${s.slice(1)}.ml`;

async function cacheBuiltin(moduleName) {
    let filePath = builtinPath(moduleName);
    fetch(filePath).then((contents) => {
        contents.text().then((val) => {
            builtinFileCache[filePath] = `module ${moduleName} = struct\n${val}\nend\n`
        });
    }).catch((error) => {
        console.error(error);
    });
}

function loadBuiltin(moduleName) {
    let filePath = builtinPath(moduleName);
    if (builtinFileCache.hasOwnProperty(filePath)) {
        return builtinFileCache[filePath];
    } else {
        return builtinFileCache.err;
    }
}

function loadExample(file) {
    if (exampleFileCache.hasOwnProperty(file)) {
        return exampleFileCache[file];
    } else {
        return exampleFileCache.err;
    }
}
