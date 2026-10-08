// Syntax highlighting + copy button for code blocks in articles
(function () {
    function copyText(text) {
        if (navigator.clipboard && window.isSecureContext) {
            return navigator.clipboard.writeText(text);
        }
        // Fallback for non-secure contexts
        return new Promise(function (resolve, reject) {
            var ta = document.createElement('textarea');
            ta.value = text;
            ta.setAttribute('readonly', '');
            ta.style.position = 'fixed';
            ta.style.opacity = '0';
            document.body.appendChild(ta);
            ta.select();
            try {
                document.execCommand('copy') ? resolve() : reject();
            } catch (e) {
                reject(e);
            } finally {
                document.body.removeChild(ta);
            }
        });
    }

    var COPY_LABEL = '<i class="fa-regular fa-copy"></i><span>Copy</span>';
    var COPIED_LABEL = '<i class="fa-solid fa-check"></i><span>Copied!</span>';

    // Java-like reserved words that must never be treated as a declared variable name
    var RESERVED = /^(?:return|new|throw|throws|extends|implements|instanceof|case|default|else|import|package|class|interface|enum|record|this|super|null|true|false)$/;

    function wrapVar(name) {
        var s = document.createElement('span');
        s.className = 'hljs-decl-var';
        s.textContent = name;
        return s;
    }

    /**
     * highlight.js only tags Java variables when they are assigned (`Type x = ...`).
     * This also tags plain declarations such as `Mountain mountain;`, `int count;`,
     * `List<String> items;` and method parameters `(String name)`.
     */
    function markJavaDeclarations(code) {
        var walker = document.createTreeWalker(code, NodeFilter.SHOW_TEXT, null);
        var nodes = [];
        while (walker.nextNode()) nodes.push(walker.currentNode);

        // Type (Capitalized, optional generics/arrays) followed by a lowercase identifier
        var typeThenName = /(\b[A-Z][\w$]*(?:<[^<>;()]*>)?(?:\[\])*\s+)([a-z_$][\w$]*)(?=\s*[;,)=:])/g;
        // Identifier right after a primitive/keyword type span, e.g. <span class="hljs-type">int</span> count;
        var leadingName = /^(\s+)([a-z_$][\w$]*)(?=\s*[;,)=:])/;

        nodes.forEach(function (node) {
            var parent = node.parentNode;
            var allowed = parent === code || /\bhljs-params\b/.test(parent && parent.className || '');
            if (!allowed) {
                return; // skip text already inside a highlighted token (strings, comments, ...)
            }
            var text = node.nodeValue;
            var frag = document.createDocumentFragment();
            var last = 0;
            var m;

            var prev = node.previousSibling;
            if (prev && prev.nodeType === 1 && /\bhljs-type\b/.test(prev.className)) {
                m = leadingName.exec(text);
                if (m && !RESERVED.test(m[2])) {
                    frag.appendChild(document.createTextNode(m[1]));
                    frag.appendChild(wrapVar(m[2]));
                    last = m[0].length;
                }
            }

            typeThenName.lastIndex = last;
            while ((m = typeThenName.exec(text)) !== null) {
                if (RESERVED.test(m[2])) continue;
                var start = m.index + m[1].length;
                frag.appendChild(document.createTextNode(text.slice(last, start)));
                frag.appendChild(wrapVar(m[2]));
                last = start + m[2].length;
            }

            if (last === 0) return;
            frag.appendChild(document.createTextNode(text.slice(last)));
            parent.replaceChild(frag, node);
        });
    }

    function enhance() {
        var blocks = document.querySelectorAll('.content-prose pre > code, .asciidoc-prose pre > code');

        blocks.forEach(function (code) {
            var pre = code.parentElement;
            if (pre.closest('.code-block')) return;

            if (window.hljs) {
                window.hljs.highlightElement(code);
            }
            if (/\blanguage-(?:java|kotlin|groovy|scala)\b/.test(code.className)) {
                markJavaDeclarations(code);
            }

            var langClass = Array.prototype.find.call(code.classList, function (c) {
                return c.indexOf('language-') === 0;
            });
            var lang = langClass ? langClass.substring('language-'.length) : 'code';

            var wrapper = document.createElement('div');
            wrapper.className = 'code-block';

            var header = document.createElement('div');
            header.className = 'code-block-header';
            header.innerHTML =
                '<span class="code-dots"><i></i><i></i><i></i></span>' +
                '<span class="code-lang"></span>';
            header.querySelector('.code-lang').textContent = lang;

            var btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'code-copy';
            btn.setAttribute('aria-label', 'Copy code to clipboard');
            btn.innerHTML = COPY_LABEL;
            btn.addEventListener('click', function () {
                copyText(code.textContent.replace(/\n$/, '')).then(function () {
                    btn.innerHTML = COPIED_LABEL;
                    btn.classList.add('copied');
                    setTimeout(function () {
                        btn.innerHTML = COPY_LABEL;
                        btn.classList.remove('copied');
                    }, 2000);
                });
            });
            header.appendChild(btn);

            pre.parentNode.insertBefore(wrapper, pre);
            wrapper.appendChild(header);
            wrapper.appendChild(pre);
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', enhance);
    } else {
        enhance();
    }
})();