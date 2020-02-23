<template>
  <div class="mt-3" v-if="CVES[0]">
    <div class="card text-white bg-secondary mb-3" style="max-width: 100%;">
      <h5 class="card-header">{{CVES[0].CVE_data_meta.ID}}</h5>
      <div class="card-body">
        <h6 class="card-title mb-0">By: {{CVES[0].CVE_data_meta.ASSIGNER}}</h6>
        <p class="card-text">STATE: {{CVES[0].CVE_data_meta.STATE}}</p>
      </div>
    </div>
    <div class="card text-white bg-secondary mb-3" style="max-width: 100%;">
      <h4
        v-if="CVES[0].affects"
        class="card-header"
      >Vendor Name: {{CVES[0].affects.vendor.vendor_data[0].vendor_name}}</h4>
      <div class="card-body">
        <h6 class="card-title mb-0">{{CVES[0].description.description_data[0].value}}</h6>
      </div>
    </div>
    <div v-if="productData[0].product_name != 'n/a'">
      <h4 class="mt-5 mb-0">Version:</h4>
      <table class="table table-striped">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">Name</th>
            <th scope="col">Version</th>
          </tr>
        </thead>
          <tbody v-if="CVES[0].affects">
            <tr v-for="(pd, index) in productData" :key="pd._id">
              <th scope="row">{{index + 1}}</th>
              <th scope="row">{{pd.product_name}}</th>
              <th
              v-for="vd in pd.version.version_data"
              :key="vd._id"
              class="badge badge-pill badge-light">
                {{vd.version_value}}
                </th>
            </tr>
          </tbody>
      </table>
    </div>
    <h4 class="mt-5 mb-0">Reference:</h4>
    <table class="table table-striped">
      <thead>
        <tr>
          <th scope="col">#</th>
          <th scope="col">Name</th>
          <th scope="col">Source</th>
        </tr>
      </thead>
      <tbody v-if="CVES[0].references">
        <tr v-for="(ref, index) in CVES[0].references.reference_data" :key="ref._id">
          <th scope="row">{{index + 1}}</th>
          <th>
            <a v-bind:href="ref.url">{{ref.name}}</a>
          </th>
          <th>{{ref.refsource}}</th>
        </tr>
      </tbody>
    </table>
    <button
      type="button"
      v-on:click="previousPage"
      class="btn btn-outline-danger btn-lg btn-block mb-3"
    >Back</button>
  </div>
</template>
<script>
const SEARCH_URL = 'http://localhost:3000/byId';

export default {
  name: 'Detail',
  data: () => ({
    CVES: [],
  }),
  mounted() {
    fetch(`${SEARCH_URL}?id=${this.$route.query.id}`)
      .then(response => response.json())
      .then((result) => {
        this.CVES = result;
        console.log(this.CVES);
      });
  },
  methods: {
    previousPage() {
      window.history.back();
    },
  },
  computed: {
    productData() {
      if (this.CVES[0].affects.vendor.vendor_data) {
        return this.CVES[0].affects.vendor.vendor_data[0].product.product_data;
      }
      return null;
    },
  },
};
</script>

<style>
</style>
