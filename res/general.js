
// 公共布局控制函数
function initLayout() {
    const header = document.querySelector('.header');
    const footer = document.querySelector('.footer');
    if (!header || !footer) return; // 等待元素加载

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
    if (toggleBtn) {
        toggleBtn.textContent = styl === 'dark' ? '☀️' : '🌙';

        // 点击切换
        toggleBtn.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            // 更新按钮图标
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
    
    // 1. 固定页头
    const headerHeight = header.offsetHeight;
    header.style.position = 'fixed';
    header.style.top = '0';
    header.style.left = '0';
    header.style.right = '0';
    document.body.style.paddingTop = headerHeight + 'px'; // 避免内容被遮挡




    // 2. 调整页脚位置
    function adjustFooter() {
        const contentHeight = document.body.scrollHeight; // 整个文档内容高度
        const windowHeight = window.innerHeight;
        const footerHeight = footer.offsetHeight;

        // 如果内容高度不足以填满视口，将页脚固定在底部
        if (contentHeight - headerHeight < windowHeight) {
            footer.style.position = 'fixed';
            footer.style.bottom = '0';
            footer.style.left = '0';
            footer.style.right = '0';
            // 避免页脚遮挡内容：给 body 添加下内边距
            document.body.style.paddingBottom = footerHeight + 'px';
        } else {
            // 恢复正常文档流
            footer.style.position = '';
            footer.style.bottom = '';
            footer.style.left = '';
            footer.style.right = '';
            document.body.style.paddingBottom = '';
        }
    }

    adjustFooter();

    // 监听窗口大小变化和内容变化（例如动态加载内容）
    window.addEventListener('resize', adjustFooter);
    // 监听可能影响布局的 DOM 变化（比如动态加载内容）
    const observer = new MutationObserver(adjustFooter);
    observer.observe(document.body, { childList: true, subtree: true, attributes: true });
}

// 加载头尾并等待渲染完成后初始化布局
Promise.all([
    fetch('header.html').then(res => res.text()).then(data => {
        document.getElementById('header').innerHTML = data;
        return new Promise(resolve => setTimeout(resolve, 10)); // 确保 DOM 更新
    }),
    fetch('footer.html').then(res => res.text()).then(data => {
        document.getElementById('footer').innerHTML = data;
        return new Promise(resolve => setTimeout(resolve, 10));
    })
]).then(() => {
    initLayout();
}).catch(err => console.error('加载头尾失败:', err));