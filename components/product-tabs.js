Vue.config.devtools = true

Vue.component( 'product-tabs', {
  props: {
    productUid: {
      type: Number,
      required: true
    },
    reviews: {
      type: Array,
      required: true
    },
    details: {
      type: Array,
      required: true,
      default: []
    },
    shipping: {
      type: String,
      required: true
    }
  },
  template: `
    <div class="product-tabs">
      <ul>
        <li v-for="(tab, index) in tabs" :key="index" class="product-tab small" :class="{selected: selectedTab == tab}" @click="selectedTab = tab">
          {{tab}}
          <span v-if="tab === 'Reviews'">({{reviews.length}})</span>
        </li>
      </ul>
      <div class="product-tab-box product-reviews" v-show="selectedTab === 'Reviews'">
        <h2>Product reviews</h2>
        <ol v-if="reviews.length" class="small">
          <li v-for="review in reviews">
            <h3>{{review.title}}</h3>
            <p>{{review.review}}</p>
            <p>Rating: {{review.rating}}/5</p>
            <p>I
              <span v-if="review.recommend === 'true'">would</span>
              <span v-else>wouldn't</span>
              recommend this product
            </p>
            <p>Rated by {{review.name}}</p>
          </li>
        </ol>
        <p v-else class="product-no-reviews">There are no reviews yet.</p>
      </div>
      <div class="product-tab-box product-add-a-review" v-show="selectedTab === 'Add a review'">
        <h2>Add a review</h2>
        <!--
          addReview is a method of product (product-review's grandparent)
          not of this component, product-tabs (product-review's parent)
          so Vue cannot find it.
          So we use the global eventBus instead.
          <product-review :id="id" @review-submitted="addReview"></product-review>
        -->
        <product-review :productUid="productUid"></product-review>
      </div>
      <div class="product-tab-box product-shipping" v-show="selectedTab === 'Shipping'">
        <p class="small">Shipping: {{shipping}}</p>
      </div>
      <div class="product-tab-box product-details" v-show="selectedTab === 'Details'">
        <product-details :details="details"></product-details>
      </div>  
    </div>    
  `,
  data() {
    return {
      tabs: [
        'Reviews',
        'Add a review',
        'Shipping',
        'Details'
      ],
      selectedTab: 'Reviews'
    }
  },
  methods: {
    //
  }
});
