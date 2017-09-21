level0 = function(owner, text){
    var start = text.lastIndexOf("{");
    if (start >= 0){
        var end = text.indexOf("}", start);
        if (end >= 0){
            var part1 = text.slice(0, start);
            var part2 = text.slice(start + 1,end);
            var part3 = text.slice(end + 1);
            owner.push(part2);
            text = part1 + "(block" + (owner.length-1) + ")" + part3;
            return level0(owner, text);
        }
        else{
            throw "no end found";
        }
    }
    owner.push(text);
    return text;
}

level1 = function(owner, index, code){
    var selectorRegex = /(([_$A-Za-z0-9]+)?(#[_$A-Za-z0-9]+)?(\.[_$A-Za-z0-9]+)*)\(block(\d+)\)/ig;
    while (match = selectorRegex.exec(code)){
        if (match[1]){
            var part1 = code.slice(0, match.index);
            var part2 = code.slice(match.index + match[1].length);
            owner.push(match[1]);
            code = part1 + "(selector" + (owner.length-1) + ")" + part2;
            owner[index] = code;
        }
    }
}

level2 = function(owner, code){
    var blockRegex = /\(block(\d+)\)/ig;
    var parts = code.split(';');
    var results = [];
    for (var i = 0; i < parts.length; i++){
        var line = parts[i];
        line = line.trim();
        if (!line) continue;
        var childs = [];
        while (match = blockRegex.exec(line)){
            if (match[1]){
                var block = owner[parseInt(match[1])];
                childs.push(level2(owner, block));
            }
        }
        results.push({ code : line, childs: childs });
    }
    return { code : code, lines: results };
}

level3 = function(items, prefix){
    if (!prefix) prefix = ' ';
    if (items.childs){
        console.log(prefix + " " + items.code);
        for (var i = 0; i < items.childs.length; i++){
            level3(items.childs[i], '  |' + prefix);   
        }
    }
    if (items.lines){
        for (var i = 0; i < items.lines.length; i++){
            level3(items.lines[i], prefix);   
        }
    }
}

translator = function(code){
    var owner = [];
    code = "{" + code + "}\n";
    code = code.replace(/\}\s*\n/ig, "};");
    var rootObj = level0(owner, code);
    for (var i = 0; i < owner.length; i++){
        level1(owner, i, owner[i]);
    }
    var items = level2(owner, rootObj);
    console.log(owner);
    level3(items);   
}

translatorOld = function(code){
    var regex = /(([_$A-Za-z0-9]+)?(#[_$A-Za-z0-9]+)?(\.[_$A-Za-z0-9]+)*[_$A-Za-z0-9]){/ig;
    code = " " + code;
    //code = code.replace(/}/ig, "})\n");
    //code = code.replace(regex, "\n_hobj.call(this, new Selector('$1'), function(){");
    code = code.replace(regex, "_default(this, '$1', '$2', '$3', '$4').accept = function(context){ \n ");
    
    /*var regex = /function\s+([_$A-Za-z0-9]\w+)?\s{0,}\(/ig;
    code = code.replace(regex, "function $1('$2$3', function(){");*/
 //   ;
   /* var match;
    while (match = regex.exec(code)){
        if (match[0] == "{" || match[1] == "") continue;
        console.log(match);
    }*/
    //return "return _root(function(){" + code + "\n})//root";
    var regex = /(([_$A-Za-z0-9]+):){/ig;
    code = code.replace(regex, "window['$2'] = function(selector){\n ");
    code = code.replace(/new Selector\(''\)/ig, "null");
    return " " + code + "\n";
}

function rootObj(selector){
    Selector.call(this, selector.source);
    //return new Promise(function(){return param});
}

function _default(thisParam, selector){
    selector = new Selector(selector);
    if (!thisParam.context) thisParam.context = [];
    var tag = selector.type ? selector.type : "rootObj";
    var context = new window[tag](selector);
    thisParam.context.push(context);
    return {
        get accept(){
            return this.result;
        },
        
        set accept(value){
            if (typeof value == "function"){
                this.result = value.call(context, thisParam);
            }
            return this.result;
        }
    }
}
