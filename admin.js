/** Admin-only price editor, backed by Firebase Auth + Firestore. */
import { firebaseConfig, adminReady, adminUid, adminUsername, adminLoginEmail } from './firebase-config.js';

const $ = selector => document.querySelector(selector);
const show = (selector, visible) => { $(selector).hidden = !visible; };
const setup = $('#setup'), loading = $('#loading'), login = $('#login-panel'), dashboard = $('#dashboard');
const itemsContainer = $('#items'), pendingLabel = $('#pending'), saveButton = $('#save');
const categoryNames = {
  'hot-drinks':'المشروبات الساخنة', 'cold-drinks':'العصائر والمشروبات الباردة',
  'dessert-cups':'الكاسات والديسيرت', 'mixed-plates':'أطباق متنوعة', 'specials':'الأصناف المميزة'
};
const PRODUCTS = JSON.parse($('#product-data').textContent);
$('#count').textContent = String(PRODUCTS.length);
let serverPrices = {}, editedPrices = new Map(), auth = null, currentUser = null, pricesRef = null;
let firestoreSdk = null, unsubscribe = null, busy = false;
let toastTimeout = 0;
function notify(message, error=false) {
  const toast = $('#message');
  toast.textContent = message; toast.classList.toggle('error', error); toast.hidden = false;
  clearTimeout(toastTimeout); toastTimeout = setTimeout(() => {toast.hidden=true;}, 5500);
}
function basePrice(item) {
  const updated = Number(serverPrices[item.id]);
  return Number.isInteger(updated) && updated > 0 && updated <= 100000 ? updated : item.price;
}
function currentPrice(item) {return editedPrices.has(item.id)? editedPrices.get(item.id):basePrice(item);}
function updatePending() {
  const changed = editedPrices.size;
  pendingLabel.textContent = changed ? `${changed} تعديل${changed>1?'ات':''} غير محفوظ` : 'كل الأسعار محفوظة';
  saveButton.disabled = !changed || busy;
  $('#undo').disabled = !changed || busy;
}
function render() {
  const query = $('#product-search').value.trim().toLocaleLowerCase();
  const category = $('#category-select').value;
  itemsContainer.replaceChildren();
  let count = 0;
  PRODUCTS.filter(p => (category === 'all' || p.category === category)
        && (`${p.ar} ${p.en}`.toLocaleLowerCase().includes(query)))
    .forEach(p => {
      count++;
      const row = document.createElement('div'); row.className='item';
      row.classList.toggle('is-dirty', editedPrices.has(p.id));
      const info = document.createElement('div');
      const name = document.createElement('div');name.className='item-name'; name.textContent=p.ar;
      const label = document.createElement('div');label.className='item-cat';label.textContent=categoryNames[p.category] || '';
      info.append(name,label);
      const price = document.createElement('label');price.className='price-field';
      const amount = document.createElement('input');amount.className='item-price';
      amount.type='number'; amount.inputMode='numeric'; amount.min='1';amount.max='100000';amount.step='1';
      amount.value=String(currentPrice(p));
      amount.setAttribute('aria-label', `سعر ${p.ar} بالجنيه`);
      const currency = document.createElement('span'); currency.textContent='جنيه';
      price.append(amount,currency);
      amount.addEventListener('input', () => {
        const val=Number(amount.value);
        const valid=amount.value!=='' && Number.isInteger(val) && val >=1 && val<=100000;
        amount.setCustomValidity(valid?'':'اكتب سعرًا صحيحًا من 1 إلى 100000 جنيه');
        if (valid && val!==basePrice(p)) editedPrices.set(p.id,val);
        else editedPrices.delete(p.id);
        row.classList.toggle('is-dirty', editedPrices.has(p.id));
        updatePending();
      });
      row.append(info,price);itemsContainer.appendChild(row);
    });
  show('#empty-items',count===0);
  updatePending();
}
$('#product-search').addEventListener('input',render);
$('#category-select').addEventListener('change',render);
$('#undo').addEventListener('click',()=>{editedPrices.clear();render();notify('رجّعنا الأسعار لآخر نسخة محفوظة.');});

async function savePrices() {
  if (!auth?.currentUser || auth.currentUser.uid !== adminUid || !pricesRef || busy) return;
  for (const input of itemsContainer.querySelectorAll('.item-price')) {
    if (!input.checkValidity()) {input.reportValidity(); return;}
  }
  if (!editedPrices.size) return;
  const toSave=Object.fromEntries(PRODUCTS.map(item=>[item.id,currentPrice(item)]));
  busy=true;saveButton.textContent='جاري الحفظ…';updatePending();
  try {
    await firestoreSdk.setDoc(pricesRef,{prices:toSave,updatedAt:firestoreSdk.serverTimestamp()});
    serverPrices=toSave;
    editedPrices.clear();
    render();
    notify('تم حفظ الأسعار! أي زبون فاتح المنيو هيوصله التحديث تلقائيًا.');
  } catch(err) {
    console.error(err);
    notify(err.code==='permission-denied'?'غير مسموح بتعديل الأسعار. تأكد إن UID الأدمن مطابق لقواعد Firestore.':'تعذر حفظ الأسعار. راجع الإنترنت وإعدادات Firebase.',true);
  } finally {busy=false;saveButton.textContent='حفظ الأسعار';updatePending();}
}
saveButton.addEventListener('click', savePrices);

if (!adminReady) {
  show('#loading',false);show('#setup',true);
} else {
  Promise.all([
    import('https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js'),
    import('https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js'),
    import('https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js')
  ]).then(async ([appSdk,authSdk,dbSdk])=>{
    const app=appSdk.initializeApp(firebaseConfig);
    auth=authSdk.getAuth(app);firestoreSdk=dbSdk;
    const db=dbSdk.getFirestore(app);
    pricesRef=dbSdk.doc(db,'menu','prices');
    await authSdk.setPersistence(auth,authSdk.browserLocalPersistence);
    const loginButton=$('#login-button');
    $('#login-form').addEventListener('submit',async(event)=>{
      event.preventDefault();
      loginButton.disabled=true;loginButton.textContent='جاري الدخول…';
      try{
        const username = $('#username').value.trim();
        if (username !== adminUsername) { notify('اسم المستخدم أو كلمة المرور غير صحيحة.', true); return; }
        await authSdk.signInWithEmailAndPassword(auth, adminLoginEmail, $('#password').value);
        $('#password').value='';
      }catch(e){console.error('Login error:',e.code);notify('بيانات الدخول غير صحيحة أو الحساب غير مفعل.',true);}
      finally{loginButton.disabled=false;loginButton.textContent='تسجيل الدخول';}
    });
    $('#logout').addEventListener('click',()=>authSdk.signOut(auth));
    authSdk.onAuthStateChanged(auth,user=>{
      show('#loading',false);
      if(unsubscribe){unsubscribe();unsubscribe=null;}
      currentUser=user;
      const isAdmin=!!user && user.uid===adminUid;
      show('#login-panel',!isAdmin);
      show('#dashboard',isAdmin);
      show('#logout',!!user);
      if(user && !isAdmin) {
        notify('الحساب الحالي ليس هو الأدمن المسموح له. سجّل الخروج ثم ادخل بحساب الأدمن.',true);
        show('#login-panel',false);
      }
      if(isAdmin){
        editedPrices.clear();render();
        unsubscribe=dbSdk.onSnapshot(pricesRef,snap=>{
          if(busy) return;
          serverPrices=snap.exists()?snap.data().prices||{}:{};
          // Avoid replacing an in-progress form; update only after saving or when clean.
          if(editedPrices.size===0) render();
        },err=>{
          console.error(err);
          notify('تعذر قراءة الأسعار من قاعدة البيانات. تحقق من قواعد Firestore.',true);
        });
      }
    });
  }).catch(err=>{
    console.error(err);
    show('#loading',false);show('#setup',true);
    $('#setup-title').textContent='تعذر الاتصال بـ Firebase';
    notify('تأكد من إعدادات المشروع والاتصال بالإنترنت.',true);
  });
}
