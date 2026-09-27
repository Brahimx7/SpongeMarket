import { supabase } from "./supabase.js";

const productsGrid = document.getElementById("productsGrid");

const { data: products, error } = await supabase
    .from("products")
    .select("*");

    
    if (error) {
    console.error(error);
} 

function renderProducts(productsArray){

    productsGrid.innerHTML = "";

     const title = document.getElementById("prod");
    if (productsArray.length === 0) {
        title.textContent = "No Products available";

        return;
    }

    title.textContent = "Products";



            let html = "";

                 productsArray.forEach(product => {
                     html += `
                         <div class="product-card">
                             <img src="${product.image}">
                             <h3>${product.title}</h3>
                             <p>$${product.price}</p>
                             <p>${product.location}</p>
                            <button class="details-btn" data-id="${product.id}">
                                View Details
                             </button>
                         </div>
                     `;
                 });

                 productsGrid.innerHTML = html;


                 const detailsButtons = document.querySelectorAll(".details-btn");

                 detailsButtons.forEach(button => {

                     button.addEventListener("click", () => {

                         const id = button.dataset.id;

                         window.location.href = `product.html?id=${id}`;

                     });

                 });

}

renderProducts(products);

/*
const userProducts = JSON.parse(localStorage.getItem("products")) || [];
const allProducts = [...products, ...userProducts];
renderProducts(allProducts);
*/

 
    

   const searchInput = document.getElementById("searchInput");
   const searchBtn = document.getElementById("searchBtn");

    searchBtn.addEventListener("click", () => {
        const value = searchInput.value.toLowerCase();

        const filteredProducts = products.filter(product =>
            product.title.toLowerCase().includes(value)
        );

        renderProducts(filteredProducts);
    });

     searchInput?.addEventListener("keydown",(e)=>{
          if(e.key === "Enter"){
            const value = searchInput.value.toLowerCase();
              const filteredProducts = products.filter(product =>
                   product.title.toLowerCase().includes(value)
                  );
                  renderProducts(filteredProducts);
          }
     });


// home page Search 
const params = new URLSearchParams(window.location.search);
const searchValue = params.get("search");

if (searchValue) {

    const filteredProducts = products.filter(product =>
        product.title.toLowerCase().includes(searchValue.toLowerCase())
    );

    renderProducts(filteredProducts);

    document.getElementById("searchInput").value = searchValue;

} 


const buttons = document.querySelectorAll(".category-btn");

buttons.forEach(button => {

    button.addEventListener("click", () => {
           
         buttons.forEach(btn => btn.classList.remove("active"));
          button.classList.add("active");
        const category = button.textContent;

        if(category === "All"){

            renderProducts(products);

        }else{

            const filteredProducts = products.filter(product => {
                return product.category === category;
            });

            renderProducts(filteredProducts);

        }

    });

});







const categoryBtn = document.getElementById("categoryBtn");
const priceBtn = document.getElementById("priceBtn");
const titleBtn = document.getElementById("titleBtn");


const categoryPanel = document.getElementById("categoryPanel");
const pricePanel = document.getElementById("pricePanel");
const titlePanel = document.getElementById("titlePanel");

function hidePanels(){
      categoryPanel.classList.remove("shown");
    pricePanel.classList.remove("shown");
    titlePanel.classList.remove("shown");

   categoryPanel.classList.add("hidden");
   pricePanel.classList.add("hidden");
   titlePanel.classList.add("hidden");

    categoryBtn.textContent = "📂 Categories ▼" ; 
     priceBtn.textContent = "💰 Prices ▼" ; 
      titleBtn.textContent = "🔤 Title ▼" ; 
}
hidePanels();
categoryBtn.addEventListener("click", () => {
    resetPriceFilter();resetletter();
    const wasHiddencategories = categoryPanel.classList.contains("hidden");
    
    hidePanels();
     if(wasHiddencategories){
        categoryPanel.classList.remove("hidden");
        categoryPanel.classList.add("shown");
        categoryBtn.textContent = "📂 Categories ▲" ; 
     }
    
});

priceBtn.addEventListener("click" , ()=>{
resetPriceFilter();resetletter();
    const wasHiddenprice = pricePanel.classList.contains("hidden");
    hidePanels();
     if(wasHiddenprice){
        pricePanel.classList.remove("hidden");
        pricePanel.classList.add("shown");
        priceBtn.textContent = "💰 Prices ▲" ; 
     }
});

titleBtn.addEventListener("click" , ()=>{
resetPriceFilter();resetletter();
      const wasHiddentitle = titlePanel.classList.contains("hidden");
    hidePanels();
     if(wasHiddentitle){
        titlePanel.classList.remove("hidden");
        titlePanel.classList.add("shown");
        titleBtn.textContent = "🔤 Title ▲" ; 
     }
});



const lowHigh = document.getElementById("lowHigh");
const highLow = document.getElementById("highLow");

lowHigh.addEventListener("click", () => {
resetletter();
    const sortedProducts = [...products].sort((a, b) => a.price - b.price);

    renderProducts(sortedProducts);
    resetPriceFilter();
    resetButtonsclass();
});

highLow.addEventListener("click", () => {
resetletter()
    const sortedProducts = [...products].sort((a, b) => b.price - a.price);

    renderProducts(sortedProducts);
    resetPriceFilter();
    resetButtonsclass();

});

function resetButtonsclass(){
    
buttons.forEach(button => {

        const category = button.textContent;

        if(category === "All"){

           button.classList.add("active");

        }else{
            button.classList.remove("active");
        }


});
}

const minPrice = document.getElementById("minPrice");
const maxPrice = document.getElementById("maxPrice");

function filterByPrice() {
resetletter();
    const min = Number(minPrice.value);
    const max = Number(maxPrice.value);

    const filteredProducts = products.filter(product => {

        if (minPrice.value && product.price < min) {
            return false;
        }

        if (maxPrice.value && product.price > max) {
            return false;
        }

        return true;
    });

    renderProducts(filteredProducts);
    resetButtonsclass();
   
}

minPrice.addEventListener("input", filterByPrice);
maxPrice.addEventListener("input", filterByPrice);

function resetPriceFilter() {
    minPrice.value = "";
    maxPrice.value = "";
  
}

const AZ = document.getElementById("AZ");
const ZA = document.getElementById("ZA");
const letter = document.getElementById("letter");

AZ.addEventListener("click", () => {

    const sortedLetters = [...products].sort((A, B) =>
        A.title.localeCompare(B.title)
    );

    renderProducts(sortedLetters);
    resetPriceFilter();
resetletter();
resetButtonsclass();
});

ZA.addEventListener("click", () => {

    const sortedLetters = [...products].sort((A, B) =>
        B.title.localeCompare(A.title)
    );

    renderProducts(sortedLetters);
    resetPriceFilter();
resetletter();
resetButtonsclass();
});

letter.addEventListener("input", () => {

    const selectedLetter = letter.value.toLowerCase();

    const filteredProducts = products.filter(product => {
        return product.title.toLowerCase().startsWith(selectedLetter);
    });

    renderProducts(filteredProducts);
    resetPriceFilter();
    resetButtonsclass();
    
});

function resetletter(){
    letter.value = "";
}


const reset = document.getElementById("resetBtn");

reset.addEventListener("click", () => {

    minPrice.value = "";
    maxPrice.value = "";
    letter.value = "";
   resetPriceFilter();resetletter();
    renderProducts(products);
  resetButtonsclass();


});


const selectedCategory = params.get("category");

if (selectedCategory) {
    categoryPanel.classList.remove("hidden");
        categoryPanel.classList.add("shown");
        categoryBtn.textContent = "📂 Categories ▲" ; 
    buttons.forEach(button => {
        if (button.textContent === selectedCategory) {
          
            button.classList.add("active");
        } else {
            button.classList.remove("active");
        }
    });

    const filteredProducts = products.filter(product =>{
        return  product.category === selectedCategory;
    });

    renderProducts(filteredProducts);
   
}
const Footercategory = params.get("Footercategory");
if(Footercategory){
     categoryPanel.classList.remove("hidden");
        categoryPanel.classList.add("shown");
        categoryBtn.textContent = "📂 Categories ▲" ; 
}
