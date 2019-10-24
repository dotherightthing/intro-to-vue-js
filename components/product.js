Vue.config.devtools = true

Vue.component( 'product', {
  props: {
    id: {
      type: Number,
      required: true,
      default: 1
    },
    premium: {
      type: Boolean,
      required: true
    }
  },
  template: `
    <div class="product" :id="'product-' + id">
      <!-- expression -->
      <h1 class="product-title">{{title}}</h1>
      <p class="product-description">{{description}}</p>
      <div class="product-prices small">
        <p>Price: $5.00</p>
      </div>
      <p v-if="inStock" class="stock in-stock small">
        <span>In Stock</span>
      </p>
      <p v-else class="stock out-of-stock small">
        <span>Out of Stock</span>
      </p>
      <p v-show="onSaleMessage">{{onSaleMessage}}</p>
      <!-- :attr = v-bind:attr -->
      <img :src="variantImageSrc" :alt="variantImageAlt + '.'" />
      <div class="product-colors section">
        <h2 class="small">Colours</h2>
        <ul v-if="variants.length" @mouseleave="previewVariant()" class="colors">
          <!-- @ = v-on:-->
          <li v-for="(variant, index) in variants" :key="'variant-' + index" class="color-box" @mouseenter="previewVariant(index)" :title="variant.variantColor" :style="[variantSwatch, { backgroundColor: variant.variantColor }]">
              {{variant.variantColor}}
          </li>
        </ul>
      </div>
      <div class="product-sizes section">
        <h2 class="small">Sizes</h2>
        <ul v-if="sizes.length" class="small">
          <li v-for="size in sizes" :key="size.id">{{size.size}}</li>
        </ul>
      </div>
      <div class="product-buttons section">
        <button @click="addToCart" :disabled="!inStock || incart" class="some-class" :class="{ buttonClassObject, isDisabled: incart }">Add to cart</button>
        <button @click="removeFromCart" :disabled="!incart" class="some-class" :class="{ isDisabled: !incart }">Remove from cart</button>
      </div>
      <!--
        _uid:
        I'm not sure if this is kosher,
        but I needed a way to differentiate
        multiple instances of product
        so that the use of the eventBus
        didn't result in
        a review for Product A
        being added to Product B
      -->
      <product-tabs
        :productUid="this._uid"
        :reviews="reviews"
        :shipping="shipping"
        :details="details"
      ></product-tabs>
    </div>
  `,
  data() {
    // returns a unique data object for each instance of the component
    // so for example, the cart can be incremented for one but not the other
    // omitting a value will cause the app to crash
    // 'new' seems to be a reserved keyword
    return {
      onSale: false,
      product: "Socks",
      brand: "ACME",
      incart: false,
      description: "The best socks you'll never own.",
      image: {
        src: 'socks-grey.jpg',
        alt: 'A grey pair of socks'
      },
      details: [
        "80% cotton",
        "20% polyester",
        "Gender-neutral"
      ],
      previewedVariant: 0,
      selectedVariant: 0,
      variantSwatch: {
        border: '1px solid grey',
        marginBottom: '.25rem'
      },
      variants: [
        {
          variantColor: "grey",
          variantInventory: 100
        },
        {
          variantColor: "green",
          variantInventory: 2
        },
        {
          variantColor: "blue",
          variantInventory: 11
        }
      ],
      sizes: [
        {
          id: 1,
          size: "large"
        },
        {
          id: 2,
          size: "medium"
        },
        {
          id: 3,
          size: "small"
        }
      ],
      buttonClassObject: {
      //   isDisabled: notInStock2 // this doesn't work
      },
      reviews: []
    }
  },
  // methods = data properties
  methods: {
    addToCart() {
      // emit an event which the parent Vue instance can listen for
      // the template specifies the method to call
      this.$emit('add-to-cart', this.id);
      this.incart = true;
    },
    removeFromCart() {
      this.$emit('remove-from-cart', this.id);
      this.incart = false;
    },
    previewVariant(index) {
      let previewTimer;

      if ( index ) {
        clearTimeout(previewTimer);
          this.previewedVariant = index;
      } else {
        const _this = this;
        previewTimer = setTimeout( function() {
          _this.previewedVariant = _this.selectedVariant
        }, 100 );
      }
    }
    // addReview was being emitted by product-review
    // but the addition of product-tabs means that
    // product-review is now a grandchild of this component (product).
    // So we use the global eventBus instead.
    //
    // addReview(productReview) {
    //   this.reviews.push(productReview)
    // }
  },
  // computed properties - return values are cached
  // this makes them better than methods for expensive operations
  computed: {
    title() {
      return `${this.brand} ${this.product}`;
    },
    variantImageSrc() {
      const variantColor = this.variants[this.previewedVariant].variantColor;
      return `socks-${variantColor}.jpg`;
    },
    variantImageAlt() {
      const variantColor = this.variants[this.previewedVariant].variantColor;
      return `A ${variantColor} pair of socks`;
    },
    inStock() {
      const variantInventory = this.variants[this.previewedVariant].variantInventory;
      return variantInventory > 10;
    },
    onSaleMessage() {
      return this.onSale ? `${this.brand} ${this.product} is on sale now!!` : ''
    },
    shipping() {
      return this.premium ? 'Free' : '2.99';
    }
  },
  // life-cycle hooks
  mounted() {
    // see product-review.js
    eventBus.$on('review-submitted', (productReview, uid) => {
      if ( uid === this._uid ) {
        // see product.js
        this.reviews.push(productReview);
      }
    });
  }
});
