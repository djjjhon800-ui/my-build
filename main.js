// 主要JavaScript文件
// 包含所有页面的交互效果和动画

// 全局变量
let particles = [];
let canvas;

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    initMobileMenu();
    initScrollAnimations();
    initParticleBackground();
    initTextAnimations();
    initSkillTags();
});

// 移动端菜单功能
function initMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', function() {
            mobileMenu.classList.toggle('hidden');
        });
    }
}

// 滚动动画
function initScrollAnimations() {
    // 使用Intersection Observer实现滚动动画
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // 观察所有需要动画的元素
    const animatedElements = document.querySelectorAll('.card-hover, .skill-tag');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'all 0.6s ease';
        observer.observe(el);
    });
}

// 粒子背景效果 (p5.js)
function initParticleBackground() {
    // 检查是否在主页
    if (document.getElementById('main-title')) {
        new p5(function(p) {
            let particles = [];
            let numParticles = 50;

            p.setup = function() {
                canvas = p.createCanvas(p.windowWidth, p.windowHeight);
                canvas.id('p5-canvas');
                canvas.position(0, 0);
                canvas.style('z-index', '-1');
                canvas.style('position', 'fixed');

                // 创建粒子
                for (let i = 0; i < numParticles; i++) {
                    particles.push(new Particle(p));
                }
            };

            p.draw = function() {
                p.clear();
                
                // 更新和绘制粒子
                for (let particle of particles) {
                    particle.update();
                    particle.display();
                    particle.connect(particles);
                }
            };

            p.windowResized = function() {
                p.resizeCanvas(p.windowWidth, p.windowHeight);
            };

            // 粒子类
            function Particle(p) {
                this.pos = p.createVector(p.random(p.width), p.random(p.height));
                this.vel = p.createVector(p.random(-0.5, 0.5), p.random(-0.5, 0.5));
                this.size = p.random(2, 4);

                this.update = function() {
                    this.pos.add(this.vel);
                    
                    // 边界检测
                    if (this.pos.x < 0 || this.pos.x > p.width) this.vel.x *= -1;
                    if (this.pos.y < 0 || this.pos.y > p.height) this.vel.y *= -1;
                };

                this.display = function() {
                    p.fill(255, 107, 107, 100);
                    p.noStroke();
                    p.ellipse(this.pos.x, this.pos.y, this.size);
                };

                this.connect = function(particles) {
                    for (let other of particles) {
                        let d = p5.Vector.dist(this.pos, other.pos);
                        if (d < 100) {
                            p.stroke(78, 205, 196, p.map(d, 0, 100, 50, 0));
                            p.strokeWeight(0.5);
                            p.line(this.pos.x, this.pos.y, other.pos.x, other.pos.y);
                        }
                    }
                };
            }
        });
    }
}

// 文字动画
function initTextAnimations() {
    // 主标题动画
    const mainTitle = document.getElementById('main-title');
    if (mainTitle) {
        anime({
            targets: mainTitle,
            opacity: [0, 1],
            translateY: [50, 0],
            duration: 1000,
            easing: 'easeOutExpo',
            delay: 500
        });

        // 颜色循环动画
        anime({
            targets: mainTitle,
            color: [
                {value: '#ff6b6b'},
                {value: '#4ecdc4'},
                {value: '#ff6b6b'}
            ],
            duration: 3000,
            loop: true,
            direction: 'alternate',
            easing: 'easeInOutSine'
        });
    }

    // 副标题动画
    const subtitle = document.getElementById('subtitle');
    if (subtitle) {
        anime({
            targets: subtitle,
            opacity: [0, 1],
            translateY: [30, 0],
            duration: 800,
            easing: 'easeOutExpo',
            delay: 800
        });
    }

    // 描述文字动画
    const description = document.getElementById('description');
    if (description) {
        anime({
            targets: description,
            opacity: [0, 1],
            translateY: [20, 0],
            duration: 600,
            easing: 'easeOutExpo',
            delay: 1100
        });
    }

    // 打字机效果
    typeWriter();
}

// 打字机效果
function typeWriter() {
    const subtitle = document.getElementById('subtitle');
    if (!subtitle) return;
    
    const texts = [
        '年轻创意者的数字空间',
        '全栈开发者',
        'UI/UX设计师',
        '数据分析师',
        '产品经理'
    ];
    
    let textIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    
    function type() {
        const currentText = texts[textIndex];
        
        if (isDeleting) {
            subtitle.textContent = currentText.substring(0, charIndex - 1);
            charIndex--;
        } else {
            subtitle.textContent = currentText.substring(0, charIndex + 1);
            charIndex++;
        }
        
        let typeSpeed = isDeleting ? 50 : 100;
        
        if (!isDeleting && charIndex === currentText.length) {
            typeSpeed = 2000;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            textIndex = (textIndex + 1) % texts.length;
            typeSpeed = 500;
        }
        
        setTimeout(type, typeSpeed);
    }
    
    // 延迟开始打字机效果
    setTimeout(type, 2000);
}

// 技能标签动画
function initSkillTags() {
    const skillTags = document.querySelectorAll('.skill-tag');
    
    skillTags.forEach((tag, index) => {
        // 悬停效果
        tag.addEventListener('mouseenter', function() {
            anime({
                targets: this,
                scale: 1.1,
                rotate: '2deg',
                duration: 300,
                easing: 'easeOutElastic(1, .8)'
            });
        });
        
        tag.addEventListener('mouseleave', function() {
            anime({
                targets: this,
                scale: 1,
                rotate: '0deg',
                duration: 300,
                easing: 'easeOutElastic(1, .8)'
            });
        });
        
        // 初始动画
        anime({
            targets: tag,
            opacity: [0, 1],
            translateY: [20, 0],
            duration: 600,
            easing: 'easeOutExpo',
            delay: 1500 + (index * 100)
        });
    });
}

// 卡片悬停效果
document.addEventListener('DOMContentLoaded', function() {
    const cards = document.querySelectorAll('.card-hover');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            anime({
                targets: this,
                translateY: -8,
                rotateX: 5,
                scale: 1.02,
                duration: 300,
                easing: 'easeOutCubic'
            });
        });
        
        card.addEventListener('mouseleave', function() {
            anime({
                targets: this,
                translateY: 0,
                rotateX: 0,
                scale: 1,
                duration: 300,
                easing: 'easeOutCubic'
            });
        });
    });
});

// 按钮波纹效果
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('ripple')) {
        const button = e.target;
        const rect = button.getBoundingClientRect();
        const ripple = document.createElement('span');
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.classList.add('ripple-effect');
        
        button.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    }
});

// 添加波纹效果的CSS
const style = document.createElement('style');
style.textContent = `
    .ripple {
        position: relative;
        overflow: hidden;
    }
    
    .ripple-effect {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.3);
        transform: scale(0);
        animation: ripple-animation 0.6s linear;
        pointer-events: none;
    }
    
    @keyframes ripple-animation {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// 平滑滚动
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// 滚动时导航栏效果
window.addEventListener('scroll', function() {
    const nav = document.querySelector('nav');
    if (window.scrollY > 100) {
        nav.style.backgroundColor = 'rgba(0, 0, 0, 0.95)';
        nav.style.backdropFilter = 'blur(10px)';
    } else {
        nav.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
        nav.style.backdropFilter = 'blur(5px)';
    }
});

// 页面加载完成后的欢迎动画
window.addEventListener('load', function() {
    // 创建欢迎提示
    setTimeout(() => {
        const welcome = document.createElement('div');
        welcome.innerHTML = '🎉 欢迎来到我的数字空间！';
        welcome.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: linear-gradient(45deg, #ff6b6b, #4ecdc4);
            color: white;
            padding: 20px 30px;
            border-radius: 15px;
            font-size: 18px;
            font-weight: bold;
            z-index: 1000;
            box-shadow: 0 10px 30px rgba(0,0,0,0.3);
            opacity: 0;
            transition: all 0.3s ease;
        `;
        document.body.appendChild(welcome);
        
        // 显示动画
        setTimeout(() => {
            welcome.style.opacity = '1';
            welcome.style.transform = 'translate(-50%, -50%) scale(1.1)';
        }, 100);
        
        // 3秒后消失
        setTimeout(() => {
            welcome.style.opacity = '0';
            welcome.style.transform = 'translate(-50%, -50%) scale(0.8)';
            setTimeout(() => {
                welcome.remove();
            }, 300);
        }, 3000);
    }, 1000);
});

// 导出函数供其他页面使用
window.WebsiteAnimations = {
    initMobileMenu,
    initScrollAnimations,
    initTextAnimations,
    typeWriter
};