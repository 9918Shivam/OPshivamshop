
const LS_PRODUCTS = 'ope_products',
      LS_USERS = 'ope_users',
      LS_CURRENT_USER = 'ope_current_user';

      
let products = [];




const getLS = key => JSON.parse(localStorage.getItem(key) || '[]');
const setLS = (key, val) => localStorage.setItem(key, JSON.stringify(val));

function getPrimaryImage(p) {
  const fallback = 'https://via.placeholder.com/300x200?text=No+Image';
  if (p.images && p.images.length) {
    const idx = typeof p.primary === 'number' && p.primary < p.images.length ? p.primary : 0;
    return p.images[idx] || fallback;
  }
  return p.image || fallback;
}


function refreshAuth() {
  //const user = localStorage.getItem('ope_current_user');
  const user = JSON.parse(localStorage.getItem('ope_current_user') || 'null');

  document.getElementById('loginBtn')?.classList.toggle('d-none', !!user);
  document.getElementById('signupBtn')?.classList.toggle('d-none', !!user);
  document.getElementById('logoutBtn')?.classList.toggle('d-none', !user);
}



// function refreshAuth() {
//   const user = JSON.parse(localStorage.getItem('ope_current_user') || 'null');

//   document.getElementById('loginBtn').classList.toggle('d-none', !!user);
//   document.getElementById('signupBtn').classList.toggle('d-none', !!user);
//   document.getElementById('logoutBtn').classList.toggle('d-none', !user);

//   const userDisplay = document.getElementById('userDisplay');
//   if (user) {
//     userDisplay.classList.remove('d-none');
//     userDisplay.querySelector('span').textContent = user.name || user.email;
//   } else {
//     userDisplay.classList.add('d-none');
//   }
// }




function renderProductsByCategory(products) {
  const container = document.getElementById('allProductsSection');
  if (!container) return;
  container.innerHTML = '';

  // Group by category
  const grouped = {};
  products.forEach(p => {
    const cat = p.category || 'Other';
    if (!grouped[cat]) grouped[cat] = [];
    grouped[cat].push(p);
  });

  // Render each category group
  Object.entries(grouped).forEach(([cat, items]) => {
    const section = document.createElement('section');
    section.className = 'mb-5';

    section.innerHTML = `
      <h5 class="text-capitalize mb-3">${cat}</h5>
      <div class="row g-3">
        ${items.map(p => `
          <div class="col-6 col-md-4 col-lg-3">
            <div class="card h-100 shadow-sm" style="cursor:pointer">
              <img src="${getPrimaryImage(p)}" class="card-img-top" alt="${p.name}">
              <div class="card-body">
                <h6 class="fw-bold">${p.name}</h6>
                ${(p.price && p.showPrice) ? `<span class="text-primary fw-semibold">₹${p.price}</span>` : ''}
              </div>
            </div>
          </div>
        `).join('')}
      </div>
    `;
    container.appendChild(section);

    // Attach click handlers
    section.querySelectorAll('.card').forEach((card, i) => {
      card.onclick = () => {
        location.href = 'product.html?id=' + (items[i]._id || items[i].id);
      };
    });
  });
}




// function renderProducts(list, id = 'productGrid') {
//   const grid = document.getElementById(id);
//   if (!grid) return;
//   grid.innerHTML = '';
//   if (!list.length) {
//     grid.innerHTML = '<p class="text-muted">No products.</p>';
//     return;
//   }
//   list.forEach(p => {
//     const col = document.createElement('div');
//     col.className = 'col-6 col-md-4 col-lg-3';
//     col.innerHTML = `
//       <div class="card h-100 shadow-sm" style="cursor:pointer">
//         <img src="${getPrimaryImage(p)}" class="card-img-top">
//         <div class="card-body">
//           <h6 class="fw-bold">${p.name}</h6>
            
//           ${(p.price && p.showPrice) ? `<span class="text-primary fw-semibold">₹${p.price}</span>` : ''}

//         </div>
//       </div>`;
//     col.querySelector('.card').onclick = () => {
//       location.href = 'product.html?id=' + (p._id || p.id);

//     };
//     grid.appendChild(col);
//   });
// }

// for online product display
function renderShopCats(products) {
  const cont = document.getElementById('shopCategoryGrid');
  if (!cont) return;
  cont.innerHTML = '';
  const uniq = new Map(products.filter(p => p.category).map(p => [p.category, p]));
  if (!uniq.size) {
    cont.innerHTML = '<p class="text-muted">No categories.</p>';
    return;
  }
  uniq.forEach((p, cat) => {
    const col = document.createElement('div');
    col.className = 'col-6 col-md-3';
    col.innerHTML = `
      <a href="category.html?cat=${encodeURIComponent(cat)}" class="text-decoration-none">
        <div class="card h-100 shadow-sm text-center">
          <img src="${getPrimaryImage(p)}" class="card-img-top">
          <div class="card-body">
            <h6 class="fw-bold text-capitalize">${cat}</h6>
          </div>
        </div>
      </a>`;
    cont.appendChild(col);
  });
}

// for local storage product display
// function renderShopCats() {
//   const cont = document.getElementById('shopCategoryGrid');
//   if (!cont) return;
//   cont.innerHTML = '';
//   const prods = getLS(LS_PRODUCTS);
//   const uniq = new Map(prods.filter(p => p.category).map(p => [p.category, p]));
//   if (!uniq.size) {
//     cont.innerHTML = '<p class="text-muted">No categories.</p>';
//     return;
//   }
//   uniq.forEach((p, cat) => {
//     const col = document.createElement('div');
//     col.className = 'col-6 col-md-3';
//     col.innerHTML = `
//       <a href="category.html?cat=${encodeURIComponent(cat)}" class="text-decoration-none">
//         <div class="card h-100 shadow-sm text-center">
//           <img src="${getPrimaryImage(p)}" class="card-img-top">
//           <div class="card-body">
//             <h6 class="fw-bold text-capitalize">${cat}</h6>
//           </div>
//         </div>
//       </a>`;
//     cont.appendChild(col);
//   });
// }



// for online product display
function renderCategoryNav(products) {
  const nav = document.getElementById('categoryNav');
  if (!nav) return;
  const cats = [...new Set(products.map(p => p.category))];
  if (!cats.length) {
    nav.innerHTML = '<span class="text-muted">No categories</span>';
    return;
  }
  nav.innerHTML = cats.map(c => 
    `<a href="category.html?cat=${encodeURIComponent(c)}" class="btn btn-sm btn-outline-primary rounded-pill text-capitalize">${c}</a>`
  ).join('');
}




// for local storage display
// function renderCategoryNav() {
//   const nav = document.getElementById('categoryNav');
//   if (!nav) return;
//   const prods = getLS(LS_PRODUCTS);
//   const cats = [...new Set(prods.map(p => p.category))];
//   if (!cats.length) return (nav.innerHTML = '<span class="text-muted">No categories</span>');

//   nav.innerHTML = cats
//     .map(
//       c =>
//         `<a href="category.html?cat=${encodeURIComponent(
//           c
//         )}" class="btn btn-sm btn-outline-primary rounded-pill text-capitalize">${c}</a>`
//     )
//     .join('');
// }

document.addEventListener('DOMContentLoaded', () => {
  // const products = getLS(LS_PRODUCTS); //----- for local storage
  // renderProducts(products);
  // renderShopCats();
  // renderCategoryNav();
  
  //----- script.js — only fetch + store globally-----
// fetch('/products')
//   .then(res => res.json())
//   .then(data => {
//     products = data;
//     renderShopCats(products);
//     renderCategoryNav(products);
    // DO NOT call renderProducts() her

  const productSection = document.getElementById('allProductsSection');
if (productSection) {
  productSection.innerHTML = `
    <div class="text-center my-4 w-100">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
      <p class="text-muted mt-2">Loading products...</p>
    </div>`;
}


  fetch('/products')
    .then(res => {
      if (!res.ok) throw new Error('Failed to fetch products');
      return res.json();
    })
    .then(data => {
      products = data;

      // Optional: sort products if needed
      products.sort((a, b) => (a.name || '').localeCompare(b.name || ''));

      renderShopCats(products);
      renderCategoryNav(products);
      renderProductsByCategory(products);

     
    })
    .catch(err => {
      console.error('Product fetch error:', err);
      if (grid) {
        grid.innerHTML = `
          <div class="text-center my-4">
            <p class="text-danger">⚠️ Failed to load products. Please try again later.</p>
          </div>`;
      }
    });

  refreshAuth();


  const search = document.getElementById('searchInput');
  if (search) {
    const clean = str => str.trim().toLowerCase();
    search.addEventListener('input', e => {
      const term = clean(e.target.value);
      if (!term) return renderProductsByCategory(products);
      const results = products.filter(p =>
        (p.name || '').toLowerCase().includes(term) ||
        (p.features || '').toLowerCase().includes(term) ||
        (p.category || '').toLowerCase().includes(term)
      );
       renderProductsByCategory(results);
    });
    search.closest('form').addEventListener('submit', e => e.preventDefault());
  }

  const lo = document.getElementById('logoutBtn');
  lo && lo.addEventListener('click', logout);

  const sup = document.querySelector('#signupModal form');
  sup && sup.addEventListener('submit', e => {
    e.preventDefault();
    signup(signupEmail.value.trim(), signupPassword.value);
  });

  const lform = document.querySelector('#loginModal form');
  lform && lform.addEventListener('submit', e => {
    e.preventDefault();
    login(loginEmail.value.trim(), loginPassword.value);
  });
});


async function signup(email, pwd) {
  const name = prompt("Enter your name:");
  const res = await fetch('/signup', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password: pwd })
  });
  const data = await res.json();
  if (!res.ok) return alert(data.message || 'Signup failed');
  alert('Account created');
  bootstrap.Modal.getInstance(document.getElementById('signupModal')).hide();
}

// function signup(email, pwd) {
//   const users = getLS(LS_USERS);
//   if (users.some(u => u.email === email)) {
//     alert('User exists');
//     return;
//   }
//   users.push({ email, password: pwd });
//   setLS(LS_USERS, users);
//   alert('Account created');
//   bootstrap.Modal.getInstance(document.getElementById('signupModal')).hide();
// }



async function login(email, pwd) {
  const res = await fetch('/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password: pwd })
  });
  const data = await res.json();
  if (!res.ok) return alert(data.message || 'Login failed');
  
  localStorage.setItem(LS_CURRENT_USER, JSON.stringify({ name: data.name, email: data.email }));
  bootstrap.Modal.getInstance(document.getElementById('loginModal')).hide();
  refreshAuth();
}


// function login(email, pwd) {
//   const users = getLS(LS_USERS);
//   if (!users.some(u => u.email === email && u.password === pwd)) {
//     alert('Invalid credentials');
//     return;
//   }
//   localStorage.setItem(LS_CURRENT_USER, email);
//   bootstrap.Modal.getInstance(document.getElementById('loginModal')).hide();
//   refreshAuth();
// }

function logout() {
  localStorage.removeItem(LS_CURRENT_USER);
  refreshAuth();
}
// // document.addEventListener('DOMContentLoaded',()=>{const prods=getLS(LS_PRODUCTS);renderProducts(prods);renderNav();renderShopCats();refreshAuth();const s=document.getElementById('searchInput');if(s)s.addEventListener('input',e=>{const t=e.target.value.toLowerCase();renderProducts(prods.filter(p=>p.name.toLowerCase().includes(t)))});const lo=document.getElementById('logoutBtn');if(lo)lo.addEventListener('click',logout);document.querySelector('#signupModal form')?.addEventListener('submit',e=>{e.preventDefault();signup(signupEmail.value.trim(),signupPassword.value);});document.querySelector('#loginModal form')?.addEventListener('submit',e=>{e.preventDefault();login(loginEmail.value.trim(),loginPassword.value);});});









/* OP Electronics – multi‑image support
   Updated 2025‑06‑17
*/

/* ---------- Local‑storage keys ---------- */
// const LS_PRODUCTS      = 'ope_products',
//       LS_USERS         = 'ope_users',
//       LS_CURRENT_USER  = 'ope_current_user';

// /* ---------- Helpers ---------- */
// const getLS = key => JSON.parse(localStorage.getItem(key) || '[]');
// const setLS = (key, val) => localStorage.setItem(key, JSON.stringify(val));

// /* Return the primary image URL for a product (or fallback) */
// function getPrimaryImage(p) {
//   if (p.images && p.images.length) {
//     const idx = (typeof p.primary === 'number' && p.primary < p.images.length)
//                 ? p.primary : 0;
//     return p.images[idx];
//   }
//   /* legacy single‑image support */
//   return p.image || 'https://via.placeholder.com/300x200?text=No+Image';
// }

// /* ---------- Auth ---------- */
// function refreshAuth() {
//   const u = localStorage.getItem(LS_CURRENT_USER);
//   ['loginBtn', 'signupBtn'].forEach(id => {
//     const el = document.getElementById(id);
//     if (el) el.classList.toggle('d-none', !!u);
//   });
//   const lo = document.getElementById('logoutBtn');
//   if (lo) lo.classList.toggle('d-none', !u);
// }
// function signup(email, pwd) {
//   const users = getLS(LS_USERS);
//   if (users.some(u => u.email === email)) { alert('User exists'); return; }
//   users.push({ email, password: pwd });
//   setLS(LS_USERS, users);
//   alert('Account created');
//   bootstrap.Modal.getInstance(document.getElementById('signupModal')).hide();
// }
// function login(email, pwd) {
//   const users = getLS(LS_USERS);
//   if (!users.some(u => u.email === email && u.password === pwd)) {
//     alert('Invalid credentials'); return;
//   }
//   localStorage.setItem(LS_CURRENT_USER, email);
//   bootstrap.Modal.getInstance(document.getElementById('loginModal')).hide();
//   refreshAuth();
// }
// function logout() {
//   localStorage.removeItem(LS_CURRENT_USER);
//   refreshAuth();
// }

// /* ---------- Rendering ---------- */
// function renderProducts(list, id = 'productGrid') {
//   const grid = document.getElementById(id);
//   if (!grid) return;
//   grid.innerHTML = '';
//   if (!list.length) {
//     grid.innerHTML = '<p class="text-muted">No products.</p>';
//     return;
//   }
//   list.forEach(p => {
//     const col = document.createElement('div');
//     col.className = 'col-6 col-md-4 col-lg-3';
//     col.innerHTML = `
//       <div class="card h-100 shadow-sm" style="cursor:pointer">
//         <img src="${getPrimaryImage(p)}" class="card-img-top">
//         <div class="card-body">
//           <h6 class="fw-bold">${p.name}</h6>
//           <span class="text-primary fw-semibold">₹${p.price}</span>
//         </div>
//       </div>`;
//     col.querySelector('.card').onclick = () => {
//       location.href = 'product.html?id=' + p.id;
//     };
//     grid.appendChild(col);
//   });
// }

// function renderShopCats() {
//   const cont = document.getElementById('shopCategoryGrid');
//   if (!cont) return;
//   cont.innerHTML = '';
//   const prods = getLS(LS_PRODUCTS);
//   const uniq  = new Map(
//     prods.filter(p => p.category).map(p => [p.category, p])
//   );
//   if (!uniq.size) {
//     cont.innerHTML = '<p class="text-muted">No categories.</p>';
//     return;
//   }
//   uniq.forEach((p, cat) => {
//     const col = document.createElement('div');
//     col.className = 'col-6 col-md-3';
//     col.innerHTML = `
//       <a href="category.html?cat=${encodeURIComponent(cat)}" class="text-decoration-none">
//         <div class="card h-100 shadow-sm text-center">
//           <img src="${getPrimaryImage(p)}" class="card-img-top">
//           <div class="card-body">
//             <h6 class="fw-bold text-capitalize">${cat}</h6>
//           </div>
//         </div>
//       </a>`;
//     cont.appendChild(col);
//   });
// }


// function renderCategoryNav() {
//   const nav = document.getElementById('categoryNav');
//   if (!nav) return;
//   const prods = getLS(LS_PRODUCTS);
//   const cats = [...new Set(prods.map(p => p.category))];
//   if (!cats.length) return (nav.innerHTML = '<span class="text-muted">No categories</span>');

//   nav.innerHTML = cats
//     .map(
//       c =>
//         `<a href="category.html?cat=${encodeURIComponent(
//           c
//         )}" class="btn btn-sm btn-outline-primary rounded-pill text-capitalize">${c}</a>`
//     )
//     .join('');
// }




// /* ---------- Init ---------- */
// document.addEventListener('DOMContentLoaded', () => {
//   const products = getLS(LS_PRODUCTS);
//   renderProducts(products);
//   renderShopCats();
//   renderCategoryNav();
//   refreshAuth();



//   /* search filter */
//   // const search = document.getElementById('searchInput');
//   // if (search) {
//   //   search.addEventListener('input', e => {
//   //     const term = e.target.value.toLowerCase();
//   //     renderProducts(
//   //       products.filter(
//   //         p =>
//   //           p.name.toLowerCase().includes(term) ||
//   //           (p.features || '').toLowerCase().includes(term)
//   //       )
//   //     );
//   //   });

//   //   /* NEW: stop Enter from reloading the page */
//   // search.closest('form').addEventListener('submit', e => e.preventDefault());


  

//   /* ========= SEARCH BAR ========= */
// const s = document.getElementById('searchInput');
// if (s) s.addEventListener('input', e => {
//     const t = e.target.value.toLowerCase();
//     renderProducts(products.filter(p => p.name.toLowerCase().includes(t)));
// });

//   }


  

//   /* logout */
//   const lo = document.getElementById('logoutBtn');
//   lo && lo.addEventListener('click', logout);

//   /* signup form */
//   const sup = document.querySelector('#signupModal form');
//   sup &&
//     sup.addEventListener('submit', e => {
//       e.preventDefault();
//       signup(signupEmail.value.trim(), signupPassword.value);
//     });

//   /* login form */
//   const lform = document.querySelector('#loginModal form');
//   lform &&
//     lform.addEventListener('submit', e => {
//       e.preventDefault();
//       login(loginEmail.value.trim(), loginPassword.value);
//     });
// });
