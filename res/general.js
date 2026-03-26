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
Promise.all([
    fetch('header.html').then(res => res.text()).then(data => 
    {
        document.getElementById('header').innerHTML = data;
        return new Promise(resolve => setTimeout(resolve, 10)); // 确保 DOM 更新
    }),
    fetch('footer.html').then(res => res.text()).then(data => 
    {
        document.getElementById('footer').innerHTML = data;
        return new Promise(resolve => setTimeout(resolve, 10));
    })
]).then(() => 
{
    initLayout();
}).catch(err => console.error('加载头尾失败:', err));