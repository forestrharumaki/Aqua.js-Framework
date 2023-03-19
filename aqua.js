// A javascript engine for running Aqua on the web
var var_valuebox = [
    {
        name: '$version',
        content: '1.1',
        type: 'string'
    },
    {
        name: '$aqua',
        content: 'true',
        type: 'string'
    }
];
function runAll() {
    var aquaCode = document.getElementsByTagName('aqua');
    var ielem;
    for (var i = 0; i < aquaCode.length; ++i) {
        ielem = aquaCode[i];
        runSection(ielem.innerText);
        ielem.style.display = 'none';
    }
}
function runSection(sectionText) {
    if (getVar('$aqua') === 'vsc') {
        var sectionCode = sectionText.split(';');
    }
    else {
        var sectionCode = sectionText.split('\n');
    }
    for (var j = 0; j < sectionCode.length; ++j) {
        runLine(sectionCode[j]);
    }
}
function runLine(lineText) {
    var lineCode = lineText.split(' ');
    switch (lineCode[0]) {
        case 'outf':
            var echoWords = '';
            for (var m = 1; m < lineCode.length; ++m) {
                echoWords += lineCode[m];
            }
            console.log(echoWords);
            if (echoWords.charAt(0) == '"' && echoWords.charAt(echoWords.length - 1) == '"') {
                document.body.insertAdjacentHTML('beforeend', '<span class="aqua_outf">' + echoWords.substring(1, echoWords.length - 1) + '</span>');
            }
            else if (getVar(echoWords) === '') {
                console.error('A type literal is not explicitly specified.\n' + lineCode[0] + ' function wants string.\n' + (echoWords.charAt(0)) + ' ' + echoWords.charAt(lineCode[1].length - 1));
            }
            else {
                document.body.insertAdjacentHTML('beforeend', '<span class="aqua_outf">' + getVar(echoWords).charAt(0) == '"' && getVar(echoWords).charAt(getVar(echoWords).length - 1) == '"' ? getVar(echoWords).substring(1, echoWords.length - 1) : getVar(echoWords) + '</span>');
            }
            break;
        case 'var':
            if (letVar(lineCode[2], lineCode[1])) {
                console.error('duplicate variable name.');
            }
            break;
        case 'set':
            changeVar(lineCode[1], lineCode[2]);
            break;
        default:
            console.error(lineCode[0] + ' does not exist');
            break;
    }
}
function letVar(varName, varType) {
    var l;
    for (l = 0; l < var_valuebox.length; ++l) {
        if (var_valuebox[l].name === varName) {
            return true;
        }
    }
    var varInit = {
        name: varName,
        content: '',
        type: varType
    };
    var_valuebox.push(varInit);
    return false;
}
function changeVar(varName, varContent) {
    var l;
    for (l = 0; l < var_valuebox.length; ++l) {
        if (var_valuebox[l].name === varName) {
            break;
        }
    }
    var_valuebox[l].content = varContent;
}
function getVar(varName) {
    var l;
    var returns = '';
    for (l = 0; l < var_valuebox.length; ++l) {
        if (var_valuebox[l].name === varName) {
            returns = var_valuebox[l].content;
            break;
        }
    }
    return returns;
}
changeVar('$aqua', document.getElementsByName('aquascript')[0].getAttribute('content'));
if (getVar('$aqua') === 'true' || getVar('$aqua') === 'vsc') {
    runAll();
}
else {
    console.warn('Interpreter is disabled. \nInsert "<meta name="aquascript" content="true">" in <head> of HTML');
}
