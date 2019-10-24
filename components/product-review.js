Vue.config.devtools = true

Vue.component( 'product-review', {
  props: {
    productUid: {
      type: Number,
      required: true
    }
  },
  template: `
    <form class="product-review" @submit.prevent="onSubmit">
      <legend class="small">Product review</legend>
      <div class="error small" v-show="errors.length">
        <p v-if="errors.length > 1">Please correct the following errors:</p>
        <p v-else>Please correct the following error:</p>
        <ul>
          <li v-for="error in errors">{{error}}</li>
        </ul>
      </div>
      <div class="small">
        <label :for="'product-' + productUid + '-' + name.id">{{name.label}}</label>
        <input type="text" :id="'product-' + productUid + '-' + name.id" :placeholder="name.placeholder" v-model="name.value" />
      </div>
      <div class="small">
        <label :for="'product-' + productUid + '-' + title.id">{{title.label}}</label>
        <input type="text" :id="'product-' + productUid + '-' + title.id" :placeholder="title.placeholder" v-model="title.value" />
      </div>
      <div class="small">
        <label :for="'product-' + productUid + '-' + review.id">{{review.label}}</label>
        <textarea :id="'product-' + productUid + '-' + review.id" :placeholder="review.placeholder" v-model="review.value"></textarea>
      </div>
      <div class="small">
        <label :for="'product-' + productUid + '-' + rating.id">{{rating.label}}</label>
        <select :id="'product-' + productUid + '-' + rating.id" v-model.number="rating.value">
          <option>5</option>
          <option>4</option>
          <option>3</option>
          <option>2</option>
          <option>1</option>
        </select>
      </div>
      <div class="small">
        <!-- https://vuejs.org/v2/gproductUide/forms.html#Radio -->
        <label :for="'product-' + productUid + '-' + recommend.id" :id="'product-' + productUid + '-' + recommend.productUid + '-question'">{{recommend.label}}</label>
        <label>Yes <input type="radio" id="a" checked v-model="recommend.value" value="true" :id="'product-' + productUid + '-' + recommend.id" :aria-labelledby="'product-' + productUid + '-' + recommend.productUid + '-question'"></label>
        <label>No <input type="radio" id="b" v-model="recommend.value" value="false" :aria-labelledby="'product-' + productUid + '-' + recommend.productUid + '-question'"></label>
      </div>
      <div class="submit">
        <input type="submit" value="Submit review" />
      </div>
    </form>
  `,
  data() {
    return {
      id: this.id,
      title: {
        value: null,
        placeholder: 'Title',
        label: 'Review title',
        id: 'title',
        errorMessage: 'Please add a title for your review'
      },
      name: {
        value: null,
        placeholder: 'Name',
        label: 'Your name',
        id: 'name',
        errorMessage: 'Please add your name'
      },
      review: {
        value: null,
        placeholder: 'Review',
        label: 'Review',
        id: 'review',
        errorMessage: 'Please add your review'
      },
      rating: {
        value: null,
        label: 'Rating',
        id: 'rating',
        errorMessage: 'Please add a rating'
      },
      recommend: {
        value: null,
        label: 'Would you recommend this product?',
        id: 'recommend',
        errorMessage: 'Please specify whether you\'d recommend this product'
      },
      errors: []
    }
  },
  methods: {
    onSubmit() {
      if ( this.name.value && this.title.value && this.review.value && this.rating.value && this.recommend.value ) {
        this.errors = [];

        let productReview = {
          name: this.name.value,
          title: this.title.value,
          review: this.review.value,
          rating: this.rating.value,
          recommend: this.recommend.value
        };

        // addReview is a method of product (product-review's grandparent)
        // not of product-tabs (product-review's parent)
        // So we use the global eventBus instead.
        eventBus.$emit('review-submitted', productReview, this.productUid);
        this.name.value = null,
        this.title.value = null,
        this.review.value = null,
        this.rating.value = null
        this.recommend.value = null
      } else {
        this.errors = [];

        if ( !this.name.value ) {
          this.errors.push(this.name.errorMessage);
        }
        if ( !this.title.value ) {
          this.errors.push(this.title.errorMessage);
        }
        if ( !this.review.value ) {
          this.errors.push(this.review.errorMessage);
        }
        if ( !this.rating.value ) {
          this.errors.push(this.rating.errorMessage);
        }
        if ( !this.recommend.value ) {
          this.errors.push(this.recommend.errorMessage);
        }
      }
    }
  }
});
