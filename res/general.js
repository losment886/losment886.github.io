// 计算当前页面相对于 zh/ 或 en/ 目录的路径深度
function getPathDepth() {
    const path = window.location.pathname;
    // 找到 /zh/ 或 /en/ 之后的部分
    let langIndex = path.indexOf('/zh/');
    let prefixLen = 4; // '/zh/' 长度
    if (langIndex === -1) {
        langIndex = path.indexOf('/en/');
        prefixLen = 4; // '/en/' 长度
    }
    if (langIndex === -1) return 0;
    const relativePath = path.substring(langIndex + prefixLen);
    // 去掉文件名，只算目录层级
    const dirs = relativePath.split('/').filter(s => s.length > 0);
    // 最后一段如果是 .html 文件，不计入深度
    const last = dirs[dirs.length - 1];
    if (last && last.includes('.html')) {
        return dirs.length - 1;
    }
    return dirs.length;
}


// 根据深度生成相对路径前缀
function getPrefix(depth) {
    if (depth <= 0) return './';
    return '../'.repeat(depth);
}

function initLayout() 
{
    const header = document.querySelector('.header');
    const footer = document.querySelector('.footer');
    if (!header || !footer) 
        return;
    const styl = localStorage.getItem('theme');
    if(styl === 'dark')
    {
        document.documentElement.setAttribute('data-theme', 'dark');
        header.style.background = 'rgba(33,33,33,0.6)';
        footer.style.background = 'rgba(66,66,66,1)';
    }
    else
    {
        document.documentElement.setAttribute('data-theme', 'light');
        header.style.background = 'rgba(210,210,210,0.6)';
        footer.style.background = 'rgba(240,240,240,1)';
    }
    const toggleBtn = document.getElementById('theme-toggle');
    if (toggleBtn) 
    {
        toggleBtn.textContent = styl === 'dark' ? '☀️' : '🌙';
        toggleBtn.addEventListener('click', () => 
        {
            const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            toggleBtn.textContent = newTheme === 'dark' ? '☀️' : '🌙';
            if(newTheme === 'dark')
            {
                document.documentElement.setAttribute('data-theme', 'dark');
                header.style.background = 'rgba(33,33,33,0.6)';
                footer.style.background = 'rgba(66,66,66,1)';
            }
            else
            {
                document.documentElement.setAttribute('data-theme', 'light');
                header.style.background = 'rgba(210,210,210,0.6)';
                footer.style.background = 'rgba(240,240,240,1)';
            }
        });
    }
    const headerHeight = header.offsetHeight;
    header.style.position = 'fixed';
    header.style.top = '0';
    header.style.left = '0';
    header.style.right = '0';
    document.body.style.paddingTop = headerHeight + 'px';
    function adjustFooter() 
    {
        const contentHeight = document.body.scrollHeight;
        const windowHeight = window.innerHeight;
        const footerHeight = footer.offsetHeight;
        if (contentHeight - headerHeight < windowHeight) 
        {
            footer.style.position = 'fixed';
            footer.style.bottom = '0';
            footer.style.left = '0';
            footer.style.right = '0';
            document.body.style.paddingBottom = footerHeight + 'px';
        } 
        else 
        {
            footer.style.position = '';
            footer.style.bottom = '';
            footer.style.left = '';
            footer.style.right = '';
            document.body.style.paddingBottom = '';
        }
    }
    adjustFooter();
    window.addEventListener('resize', adjustFooter);
    const observer = new MutationObserver(adjustFooter);
    observer.observe(document.body, { childList: true, subtree: true, attributes: true });
}

function Trn(lang)
{
    localStorage.setItem('chosenLanguage',lang);

    if(window.location.href.indexOf('ProductInfo/index.html') < 0)
    {
        if(window.location.href.indexOf('index') >= 0)
        {
            window.location.href = '../index.html?href=index.html';
        }
        else if(window.location.href.indexOf('about.html') >= 0)
        {
            window.location.href = '../index.html?href=about.html';
        }
        else if(window.location.href.indexOf('products.html') >= 0)
        {
            window.location.href = '../index.html?href=products.html';
        }
    }
    else
    {
        window.location.href = '../../index.html?href=' + window.location.href.substring(window.location.href.indexOf('ProductInfo/index.html'));
    }
}

window.Trn = Trn;
// 自动检测路径深度并加载 header/footer
const depth = getPathDepth();
const prefix = getPrefix(depth);
Promise.all([
    fetch(prefix + 'header.html').then(res => res.text()).then(data => 
    {
        document.getElementById('header').innerHTML = data;
        // 修正 header 中的相对路径（图片、链接等）
        const headerEl = document.querySelector('.header');
        if (headerEl) {
            // 修正所有 img 的 src 路径
            headerEl.querySelectorAll('img[src]').forEach(img => {
                const src = img.getAttribute('src');
                if (src && !src.startsWith('http://') && !src.startsWith('https://') && !src.startsWith('/')) {
                    img.src = prefix + src;
                }
            });
            // 修正导航链接
            headerEl.querySelectorAll('[onclick*="window.location.href"]').forEach(el => {
                const onclick = el.getAttribute('onclick');
                if (onclick) {
                    const fixed = onclick.replace(/\.\/(\w+\.html)/g, prefix + '$1');
                    el.setAttribute('onclick', fixed);
                }
            });
        }
        return new Promise(resolve => setTimeout(resolve, 10));
    }),
    fetch(prefix + 'footer.html').then(res => res.text()).then(data => 
    {
        document.getElementById('footer').innerHTML = data;
        return new Promise(resolve => setTimeout(resolve, 10));
    })
]).then(() => 
{
    initLayout();
}).catch(err => console.error('加载头尾失败:', err));




