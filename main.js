
// Prevent warning
// Vue.js is detected on this page. Devtools inspection is not available
// because it's in production mode or explicitly disabled by the author
Vue.config.devtools = true

// global channel for sending information
// e.g. from grandchild component to grandparent component
var eventBus = new Vue();

// new Vue instance
var app = new Vue({
  // options object
  el: "#app",
  data: {
    cart: [],
    premium: true,
    moreDetails: 'This is one of several products'
  },
  methods: {
    addToCart(id) {
      this.cart.push(id);
      this.cart = [...new Set(this.cart)]; // create a set of unique items, then spread these into an array 
    },
    removeFromCart(id) {
      const i = this.cart.indexOf(id);
      if ( i != -1 ) {
        this.cart.splice(i, 1); // splice - unite two parts
      }
    }
  }
});
