Vue.config.devtools = true

Vue.component( 'product-details', {
  props: {
    details: {
      type: Array,
      required: true,
      default: []
    }
  },
  template: `
    <div class="product-details small">
      <ul v-if="details.length">
        <li v-for="detail in details">{{detail}}</li>
      </ul>
    </div>
  `
});
