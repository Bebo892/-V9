/**
 * Halaweyat Masr Café — display-only digital menu, v8.1.
 * All product names, prices, descriptions and pictures come from index.html.
 * Only `mixed-plates` and `specials` can open the details dialog.
 */
(() => {
  'use strict';

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const categoryGrid = $('.category-grid');
  const categoryLinks = $$('.category-card');
  const menuSections = $$('.menu-section');
  const searchForm = $('#menu-search');
  const searchInput = $('#search-input');
  const searchStatus = $('#search-status');
  const noResults = $('#no-results');
  const resetFilter = $('.reset-filter');
  const stickyBar = $('#sticky-categories');
  const stickyLinks = $$('.sticky-category-link');
  const suggestions = $('#search-suggestions');
  const priceFilter = $('.price-filter');
  const priceButtons = $$('.price-filter-btn');
  const categoriesSection = $('#categories');
  const siteHeader = $('.site-header');
  const languageToggle = $('.language-toggle');
  const dialog = $('#product-dialog');
  const dialogClose = $('.dialog-close', dialog);
  const dialogVisual = $('#dialog-visual');
  const dialogCategory = $('#dialog-category');
  const dialogTitle = $('#dialog-product-name');
  const dialogDescription = $('#dialog-product-description');
  const dialogPriceLabel = $('#dialog-price-label');
  const dialogPrice = $('#dialog-price');
  const dialogIngredients = $('#dialog-ingredients');
  const dialogIngredientsLabel = $('#dialog-ingredients-label');
  const dialogIngredientChips = $('#dialog-ingredient-chips');
  const languageLabel = $('.language-toggle-label', languageToggle);
  if (!categoryGrid || !searchForm || !dialog) return;

  const categories = {
    'hot-drinks': { ar: 'المشروبات الساخنة', en: 'Hot Drinks' },
    'cold-drinks': { ar: 'العصائر والمشروبات الباردة', en: 'Juices & Cold Drinks' },
    'dessert-cups': { ar: 'الكاسات والديسيرت', en: 'Dessert Cups' },
    'mixed-plates': { ar: 'أطباق متنوعة', en: 'Assorted Plates' },
    specials: { ar: 'الأصناف المميزة', en: 'Signature Specials' }
  };
  const sectionCopy = {
    'hot-drinks': { ar: 'من القهوة التركي للكابتشينو، اختار مشروبك المفضل.', en: 'Choose your favorite, from Turkish coffee to cappuccino.' },
    'cold-drinks': { ar: 'نكهات منعشة من منيو الكافيه.', en: 'Refreshing flavors from our café menu.' },
    'dessert-cups': { ar: 'أصناف حلوة لكل وقت.', en: 'Something sweet for every moment.' },
    'mixed-plates': { ar: 'أطباق ومخبوزات بتفاصيل تستاهل تتشاف.', en: 'Plates and pastries worth exploring.' },
    specials: { ar: 'أصناف الكافيه المميزة بالصور والتفاصيل.', en: 'Explore our signature treats in detail.' }
  };
  const labels = {
    ar: {
      title: 'منيو الكافيه | حلويات مصر', skip: 'تخطي إلى المنيو', brand: 'كافيه حلويات مصر', menu: 'الأقسام',
      hero: 'كل لحظة أحلى في كافيه حلويات مصر', intro: 'اكتشف مشروباتك المفضلة وأصناف الديسيرت من منيو الكافيه.',
      explore: 'استكشف المنيو', searchLabel: 'بتدور على صنف معين؟', searchPlaceholder: 'جرّب: كابتشينو، أم علي، بانانا سبليت...',
      searchButton: 'بحث', categories: 'أقسام المنيو', showAll: 'عرض جميع الأقسام',
      currency: 'جنيه', price: 'السعر', ingredients: 'أبرز المكونات', close: 'إغلاق التفاصيل', details: 'عرض التفاصيل',
      specialBadge: 'صنف مميز', plateBadge: 'من أطباقنا', plateCaption: 'من أطباق الكافيه',
      photoPending: 'صورة الطبق هتتضاف قريبًا',
      footerNotice: 'هذا المنيو للعرض فقط، ولا توجد طلبات أو مدفوعات من خلال الموقع.',
      footerBrand: 'حلويات مصر', footerMenu: ' — منيو الكافيه الرقمي', top: 'العودة للأعلى ↑',
      noMatches: 'مفيش أصناف مطابقة للبحث. جرّب كلمة تانية.',
      matches: n => `لقينا ${n} صنف`, categoryMatches: (name,n) => `${name} — ${n} صنف`,
      view: name => `عرض تفاصيل ${name}`, changeLanguage: 'Switch to English',
      footerDescription: 'لحظات ألذ، ومنيو أسهل — استمتع بتصفح مشروبات وحلويات الكافيه.',
      footerMenuTitle: 'تصفح المنيو', footerDisclaimer: 'المنيو للعرض فقط • الأسعار قابلة للتحديث',
      suggestionLabel: 'اقتراحات البحث',
      priceFilterLabel: 'حدد ميزانيتك',
      priceRanges: {all:'كل الأسعار', under50:'أقل من 50 جنيه', between:'50 – 100 جنيه', over100:'أكثر من 100 جنيه'},
      priceFilterAria: 'فلترة الأصناف حسب السعر', noMatchesReset: 'مسح الفلاتر',
      footerContactTitle: 'تواصل مع الكافيه', footerContactDesc: 'للاستفسارات أو معرفة تفاصيل الفروع:',
      footerMap: 'عرض الموقع على Google Maps', footerCity: 'الإسكندرية، مصر', adminLink: 'دخول الإدارة'
    },
    en: {
      title: 'Café Menu | Halaweyat Masr', skip: 'Skip to menu', brand: 'Halaweyat Masr Café', menu: 'Categories',
      hero: 'Every moment is sweeter at Halaweyat Masr Café', intro: 'Explore drinks and desserts from our café menu.',
      explore: 'Explore the menu', searchLabel: 'Looking for something?', searchPlaceholder: 'Try: Cappuccino, Om Ali, Banana Split...',
      searchButton: 'Search', categories: 'Menu Categories', showAll: 'Show all categories',
      currency: 'EGP', price: 'Price', ingredients: 'Key ingredients', close: 'Close details', details: 'View details',
      specialBadge: 'Signature item', plateBadge: 'From our menu', plateCaption: 'From our café kitchen',
      photoPending: 'Photo coming soon',
      footerNotice: 'This menu is for viewing only. No orders or payments are accepted here.',
      footerBrand: 'Halaweyat Masr', footerMenu: ' — Digital Café Menu', top: 'Back to top ↑',
      noMatches: 'No matching items. Try another search.',
      matches: n => `${n} matching item${n===1?'':'s'}`, categoryMatches: (name,n) => `${name} — ${n} item${n===1?'':'s'}`,
      view: name => `View details for ${name}`, changeLanguage: 'التبديل للعربية',
      footerDescription: 'Sweet moments, made easy — explore our café drinks and desserts.',
      footerMenuTitle: 'Explore the menu', footerDisclaimer: 'Display-only menu • Prices may change',
      suggestionLabel: 'Search suggestions',
      priceFilterLabel: 'Filter by budget',
      priceRanges: {all:'All prices', under50:'Under EGP 50', between:'EGP 50 – 100', over100:'Over EGP 100'},
      priceFilterAria: 'Filter menu by price', noMatchesReset: 'Clear filters',
      footerContactTitle: 'Contact the café', footerContactDesc: 'Questions or branch information? Call us:',
      footerMap: 'View on Google Maps', footerCity: 'Alexandria, Egypt', adminLink: 'Admin login'
    }
  };
  const state = { lang: 'ar', category: 'all', price: 'all', query: '', activeProduct: null };
  const products = $$('.product-card').map(card => ({
    card,
    id: card.dataset.productId,
    basePrice: Number(card.dataset.price),
    name: card.dataset.name,
    en: card.dataset.nameEn || card.dataset.name,
    category: card.dataset.category,
    price: card.dataset.price,
    descriptionAr: card.dataset.descriptionAr || '',
    descriptionEn: card.dataset.descriptionEn || '',
    image: card.dataset.image || '',
    ingredientsAr: (card.dataset.ingredientsAr || '').split('|').filter(Boolean),
    ingredientsEn: (card.dataset.ingredientsEn || '').split('|').filter(Boolean),
    clickable: ['mixed-plates', 'specials'].includes(card.dataset.category),
    aliases: card.dataset.aliases || ''
  }));

  // Shared prices from Firestore; all existing search, filters, dialog & translations update.
  // This listener is intentionally independent of admin authentication.
  document.addEventListener('menu:prices-updated', event => {
    const live = event.detail?.prices || {};
    products.forEach(product => {
      const value = Object.prototype.hasOwnProperty.call(live, product.id)
        ? Number(live[product.id]) : product.basePrice;
      if (!Number.isInteger(value) || value <= 0 || value > 100000) return;
      product.price = String(value);
      product.card.dataset.price = String(value);
      const field = $('.price', product.card);
      if (field && field.firstChild) field.firstChild.textContent = `${value} `;
    });
    renderResults();
    updateDialog();
    updateSuggestions();
  });

  const normalize = value => String(value || '').toLocaleLowerCase().normalize('NFKC')
    .replace(/[\u064B-\u065F\u0670\u0640]/g, '')
    .replace(/[أإآ]/g, 'ا').replace(/ى/g, 'ي')
    .replace(/ؤ/g, 'و').replace(/ئ/g, 'ي')
    .replace(/[^\p{L}\p{N}]+/gu, ' ').trim();

  const t = () => labels[state.lang];
  const categoryName = id => categories[id]?.[state.lang] || id;
  const displayName = p => state.lang === 'en' ? p.en : p.name;
  const displayDescription = p => state.lang === 'en' ? p.descriptionEn : p.descriptionAr;


  // Arabic variants, accents, typing prefixes, and common café terms.
  // Search only from the local verified menu: no AI and no invented prices.
  const searchTerm = value => normalize(value).replace(/ة/g, 'ه');
  const synonyms = {
    'قهوه': ['coffee','turkish','قهوة','كابتشينو','نسكافيه','اسبريسو'],
    'coffee': ['قهوة','كابتشينو','nescafe','espresso','coffee'],
    'شوكولاته': ['chocolate','شيكولاته','شوكولاتة','كاكاو'],
    'chocolate': ['شيكولاتة','شوكولاتة','كاكاو','chocolate'],
    'ايس كريم': ['آيس كريم','ice cream','ايسكريم'],
    'juice': ['عصير','juice','مانجو','فراولة','ليمون'],
    'عصير': ['juice','ليمون','مانجو','برتقال','فراوله'],
  };
  function productMatches(p, typed) {
    const query = searchTerm(typed);
    if (!query) return true;
    const combined = searchTerm([p.name,p.en,p.descriptionAr,p.descriptionEn,p.aliases,categories[p.category].ar,categories[p.category].en].join(' '));
    const words = query.split(' ').filter(Boolean);
    if (words.every(w => combined.includes(w))) return true;
    // Special intent synonyms only for an exact single common term to avoid noise.
    if (words.length > 2) return false;
    return (synonyms[query] || []).some(word => combined.includes(searchTerm(word)));
  }

  function matchesPrice(product) {
    const price = Number(product.price);
    if (!Number.isFinite(price)) return state.price === 'all';
    if (state.price === 'under50') return price < 50;
    if (state.price === 'between') return price >= 50 && price <= 100;
    if (state.price === 'over100') return price > 100;
    return true;
  }

  function resetAll() {
    state.category = 'all'; state.price = 'all'; state.query = '';
    searchInput.value = '';
    closeSuggestions(); renderResults(true);
  }

  function revealResults() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let i = 0;
    products.filter(p => !p.card.hidden).slice(0, 22).forEach(p => {
      const card = p.card;
      card.classList.remove('filter-reveal');
      card.style.setProperty('--reveal-index', Math.min(i++, 9));
      void card.offsetWidth;
      card.classList.add('filter-reveal');
    });
  }

  function matchingProducts() {
    if (!searchInput.value.trim()) return [];
    return products.filter(p => productMatches(p,searchInput.value))
      .sort((a,b) => {
        const q=searchTerm(searchInput.value);
        const arA=searchTerm(a.name), arB=searchTerm(b.name);
        const enA=searchTerm(a.en), enB=searchTerm(b.en);
        const aa=Number(arA.startsWith(q)||enA.startsWith(q));
        const bb=Number(arB.startsWith(q)||enB.startsWith(q));
        return bb-aa;
      });
  }
  function closeSuggestions() {
    suggestions.hidden = true;
    suggestions.replaceChildren();
    searchInput.setAttribute('aria-expanded','false');
  }
  function updateSuggestions() {
    suggestions.replaceChildren();
    if (!searchInput.value.trim() || document.activeElement!==searchInput) { closeSuggestions(); return; }
    const matches=matchingProducts().slice(0,6);
    if (!matches.length) {closeSuggestions(); return;}
    suggestions.setAttribute('aria-label',t().suggestionLabel);
    matches.forEach(product => {
      const button=document.createElement('button');
      button.type='button'; button.className='suggestion-item';
      button.setAttribute('role','option'); button.setAttribute('aria-selected','false');
      const name=document.createElement('strong'); name.textContent=displayName(product);
      const amount=document.createElement('span'); amount.textContent=product.price+' '+t().currency;
      button.append(name,amount);
      button.addEventListener('click',()=>{
        state.query=''; state.category='all';
        searchInput.value=''; renderResults(); closeSuggestions();
        if (product.clickable) openDetails(product);
        else product.card.scrollIntoView({behavior:scrollBehavior(),block:'center'});
      });
      suggestions.append(button);
    });
    suggestions.hidden=false;
    searchInput.setAttribute('aria-expanded','true');
  }
  const scrollBehavior=() => window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth';
  function setCategory(filter) {
    state.category = state.category === filter ? 'all' : filter;
    state.query = ''; searchInput.value=''; closeSuggestions(); renderResults(true);
    (state.category==='all' ? categoriesSection : document.getElementById(state.category))
      ?.scrollIntoView({behavior:scrollBehavior(),block:'start'});
  }
  function updateSticky() {
    const h=siteHeader.getBoundingClientRect().height;
    document.documentElement.style.setProperty('--v6-header-height',`${Math.round(h)}px`);
    const visible=categoriesSection.getBoundingClientRect().bottom < h+8 &&
      $('.site-footer').getBoundingClientRect().top > h+85;
    stickyBar.classList.toggle('is-visible',visible);
    stickyBar.setAttribute('aria-hidden',String(!visible));
  }

  function renderResults(animate = false) {
    const query = normalize(state.query);
    let shownCount = 0;
    products.forEach(product => {
      const matchCategory = state.category === 'all' || product.category === state.category;
      const show = matchCategory && matchesPrice(product) && (!query || productMatches(product,state.query));
      product.card.hidden = !show;
      if (show) shownCount += 1;
    });
    menuSections.forEach(section => {
      section.hidden = !products.some(p => p.category === section.id && !p.card.hidden);
    });
    [...categoryLinks,...stickyLinks].forEach(link => {
      const selected = state.category === link.dataset.filter;
      link.classList.toggle('is-active', selected);
      if (selected) link.setAttribute('aria-current', 'true');
      else link.removeAttribute('aria-current');
    });
    resetFilter.hidden = state.category === 'all' && state.price === 'all' && !state.query.trim();
    priceButtons.forEach(btn => {
      const active = btn.dataset.priceRange === state.price;
      btn.classList.toggle('is-active', active);
      btn.setAttribute('aria-pressed', String(active));
    });
    updateSticky();
    noResults.hidden = shownCount > 0;
    noResults.replaceChildren();
    if (shownCount === 0) {
      const message = document.createElement('p');
      message.textContent = t().noMatches;
      const clear = document.createElement('button');
      clear.type = 'button'; clear.className = 'no-results-reset';
      clear.textContent = t().noMatchesReset;
      clear.addEventListener('click', () => { resetAll(); searchInput.focus(); });
      noResults.append(message, clear);
    }
    searchStatus.textContent = query || state.price !== 'all'
      ? t().matches(shownCount)
      : state.category !== 'all' ? t().categoryMatches(categoryName(state.category), shownCount) : '';
    if (animate) revealResults();
  }

  function updateDialog() {
    const product = state.activeProduct;
    if (!product || !product.clickable) return;
    dialogCategory.textContent = categoryName(product.category);
    dialogTitle.textContent = displayName(product);
    dialogDescription.textContent = displayDescription(product);
    dialogDescription.hidden = !dialogDescription.textContent;
    dialogPriceLabel.textContent = t().price;
    dialogPrice.textContent = `${product.price} ${t().currency}`;
    dialogClose.setAttribute('aria-label', t().close);
    const ingredients = state.lang === 'ar' ? product.ingredientsAr : product.ingredientsEn;
    dialogIngredients.hidden = ingredients.length === 0;
    dialogIngredientsLabel.textContent = t().ingredients;
    dialogIngredientChips.replaceChildren();
    ingredients.forEach((name, i) => {
      const chip = document.createElement('span');
      chip.className = 'dialog-ingredient-chip';
      chip.textContent = name;
      chip.style.setProperty('--chip-index', i);
      dialogIngredientChips.appendChild(chip);
    });
    dialogVisual.replaceChildren();
    dialogVisual.classList.toggle('has-photo', Boolean(product.image));
    if (product.image) {
      const img = document.createElement('img');
      img.src = product.image;
      img.alt = displayName(product);
      img.width = 800;
      img.height = 650;
      img.loading = 'eager';
      dialogVisual.append(img);
    } else {
      const mark = document.createElement('span');
      mark.className = 'dialog-placeholder-mark';
      mark.setAttribute('aria-hidden', 'true');
      mark.textContent = '✧';
      const caption = document.createElement('span');
      caption.className = 'dialog-placeholder-caption';
      caption.textContent = t().photoPending;
      dialogVisual.append(mark, caption);
    }
  }

  function openDetails(product) {
    if (!product?.clickable) return;
    state.activeProduct = product;
    updateDialog();
    if (!dialog.open) dialog.showModal();
    document.body.classList.add('dialog-open');
    dialogClose.focus({ preventScroll: true });
  }

  function closeDetails() {
    if (dialog.open) dialog.close();
  }

  function translatePage() {
    const x = t();
    document.documentElement.lang = state.lang;
    document.documentElement.dir = state.lang === 'ar' ? 'rtl' : 'ltr';
    document.title = x.title;
    $('.skip-link').textContent = x.skip;
    $('.brand').setAttribute('aria-label', x.brand);
    $('.brand-name').textContent = x.brand;
    $('.header-menu-link').textContent = x.menu;
    languageLabel.textContent = state.lang === 'ar' ? 'EN' : 'عربي';
    languageToggle.setAttribute('aria-label', x.changeLanguage);
    $('#hero-title').textContent = x.hero;
    $('.hero-content > p:not(.eyebrow)').textContent = x.intro;
    $('.primary-link').textContent = x.explore;
    $('.search-form label').textContent = x.searchLabel;
    searchInput.placeholder = x.searchPlaceholder;
    $('.search-field button').textContent = x.searchButton;
    $('#categories-title').textContent = x.categories;
    resetFilter.firstChild.textContent = x.showAll + ' ';
    categoryLinks.forEach(link => {
      $('strong',link).textContent = categoryName(link.dataset.filter);
    });
    menuSections.forEach(section => {
      $('h2',section).textContent = categoryName(section.id);
      $('.section-intro',section).textContent = sectionCopy[section.id][state.lang];
    });
    products.forEach(product => {
      if (!product.clickable) {
        $('.product-title',product.card).textContent = displayName(product);
      } else {
        $('.product-title',product.card).textContent = displayName(product);
        $('.product-badge',product.card).textContent = product.category === 'specials' ? x.specialBadge : x.plateBadge;
        $('.card-more',product.card).firstChild.textContent = x.details + ' ';
        const tap = $('.product-tap',product.card);
        tap.setAttribute('aria-label',x.view(displayName(product)));
        if (!product.image) $('.plate-visual-caption',product.card).textContent = x.plateCaption;
        else $('.product-visual img',product.card).alt = displayName(product);
      }
      $('.price small',product.card).textContent = x.currency;
    });
    $('.price-filter-label').textContent = x.priceFilterLabel;
    priceFilter.setAttribute('aria-label', x.priceFilterAria);
    priceButtons.forEach(button => {button.textContent = x.priceRanges[button.dataset.priceRange];});
    $('.footer-contact-title').textContent = x.footerContactTitle;
    $('.footer-contact-desc').textContent = x.footerContactDesc;
    $('.footer-map-link').firstChild.textContent = x.footerMap + ' ';
    $('.footer-city').textContent = x.footerCity;
    $('.footer-title').textContent=x.brand;
    $('.footer-desc').textContent=x.footerDescription;
    $('.footer-links-title').textContent=x.footerMenuTitle;
    $('.footer-notice').textContent=x.footerDisclaimer;
    $('.footer-to-top').textContent=x.top;
    $('.footer-admin-text').textContent=x.adminLink;
    $('.footer-admin-link').setAttribute('aria-label',x.adminLink);
    const footerNames = {categories:x.menu,'hot-drinks':categoryName('hot-drinks'),'cold-drinks':categoryName('cold-drinks'),specials:categoryName('specials')};
    $$('[data-footer-link]').forEach(link=>link.textContent=footerNames[link.dataset.footerLink]);
    stickyLinks.forEach(link=>link.textContent=categoryName(link.dataset.filter));
    renderResults();
    updateDialog();
    updateSuggestions();
    updateSticky();
  }

  searchInput.addEventListener('input', () => {
    state.query = searchInput.value;
    state.category = 'all';
    renderResults();
    updateSuggestions();
  });
  searchInput.addEventListener('focus',updateSuggestions);
  searchInput.addEventListener('keydown',event=>{
    if(event.key==='Escape'){closeSuggestions();searchInput.blur();}
    if(event.key==='ArrowDown'&&!suggestions.hidden){event.preventDefault();suggestions.querySelector('button')?.focus();}
  });
  document.addEventListener('pointerdown',event=>{
    if(!searchForm.contains(event.target)&&!suggestions.contains(event.target)) closeSuggestions();
  });
  searchForm.addEventListener('submit', event => {
    event.preventDefault();
    state.query = searchInput.value;
    state.category = 'all';
    renderResults(); closeSuggestions();
    (menuSections.find(section => !section.hidden) || noResults).scrollIntoView({behavior:scrollBehavior(),block:'start'});
  });
  categoryGrid.addEventListener('click', event => {
    const link=event.target.closest('.category-card');
    if(!link)return;
    event.preventDefault(); setCategory(link.dataset.filter);
  });
  stickyBar.addEventListener('click',event=>{
    const link=event.target.closest('.sticky-category-link');
    if(link) setCategory(link.dataset.filter);
  });
  resetFilter.addEventListener('click',()=>{
    resetAll();
    categoriesSection.scrollIntoView({behavior:scrollBehavior(),block:'start'});
  });
  priceFilter.addEventListener('click', event => {
    const button = event.target.closest('[data-price-range]');
    if (!button) return;
    state.price = button.dataset.priceRange;
    closeSuggestions(); renderResults(true);
  });

  // Reflect the currently visible section in the fixed navigation when browsing all items.
  let scrollTick = false;
  function syncActiveStickySection() {
    scrollTick = false;
    if (state.category !== 'all' || state.price !== 'all' || state.query.trim()) return;
    const headerBottom = siteHeader.getBoundingClientRect().bottom + stickyBar.offsetHeight + 20;
    let active = null;
    menuSections.forEach(section => {
      if (!section.hidden && section.getBoundingClientRect().top <= headerBottom + 55) active = section.id;
    });
    stickyLinks.forEach(link => {
      const isActive = link.dataset.filter === active;
      link.classList.toggle('is-active', isActive);
      if (isActive) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  }
  window.addEventListener('scroll', () => {
    if (!scrollTick) {scrollTick = true; requestAnimationFrame(syncActiveStickySection);}
  }, {passive: true});
  window.addEventListener('scroll',updateSticky,{passive:true});
  window.addEventListener('resize',updateSticky,{passive:true});

  // Shimmer placeholders until each specialty image is ready.
  $$('.photo-visual img').forEach(img=>{
    const wrapper=img.closest('.photo-visual');
    if(img.complete&&img.naturalWidth>0) return;
    wrapper.classList.add('is-loading');
    const done=()=>wrapper.classList.remove('is-loading');
    img.addEventListener('load',done,{once:true});
    img.addEventListener('error',done,{once:true});
  });
  // Using real button elements means keyboard Enter/Space and accessibility work naturally.
  products.filter(product => product.clickable).forEach(product => {
    $('.product-tap',product.card).addEventListener('click', () => openDetails(product));
  });
  // Fade the text out, swap RTL/LTR at the midpoint, then bring it back in.
  // The original brown/gold hero remains; the decorative coffee was intentionally removed.
  const prefersReducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)');
  let switchingLanguage = false;
  languageToggle.addEventListener('click', () => {
    if (switchingLanguage) return;
    switchingLanguage = true;
    languageToggle.disabled = true;
    languageToggle.classList.add('is-switching');
    const swap = () => {
      state.lang = state.lang === 'ar' ? 'en' : 'ar';
      translatePage();
      document.body.classList.remove('language-transition-out');
      document.body.classList.add('language-transition-in');
    };
    const finish = () => {
      document.body.classList.remove('language-transition-in');
      languageToggle.classList.remove('is-switching');
      languageToggle.disabled = false;
      switchingLanguage = false;
    };
    if (prefersReducedMotion?.matches) {
      swap();
      finish();
      return;
    }
    document.body.classList.add('language-transition-out');
    window.setTimeout(() => {
      swap();
      window.setTimeout(finish, 270);
    }, 190);
  });
  dialogClose.addEventListener('click', closeDetails);
  dialog.addEventListener('click', event => {
    // Clicking on dark backdrop (outside dialog-shell) closes the modal.
    if (event.target === dialog) closeDetails();
  });
  dialog.addEventListener('close', () => {
    document.body.classList.remove('dialog-open');
    state.activeProduct = null;
    // Restore keyboard focus to the original item unless it was hidden by a filter.
  });


  translatePage();
  syncActiveStickySection();
  const linkedItem = new URLSearchParams(location.search).get('item');
  if (linkedItem) {
    const matched = products.find(p => p.clickable && (normalize(p.name) === normalize(linkedItem) || normalize(p.en) === normalize(linkedItem)));
    if (matched) openDetails(matched);
  }
})();
