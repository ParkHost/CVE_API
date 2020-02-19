<template>
  <div v-if="CVES[0]">
    <div class="card text-white bg-secondary mb-3" style="max-width: 100%;">
  <h3 class="card-header">{{CVES[0].CVE_data_meta.ID}}</h3>
  <div class="card-body">
    <h4 class="card-title">By: {{CVES[0].CVE_data_meta.ASSIGNER}}</h4>
    <p class="card-text">{{CVES[0].CVE_data_meta.STATE}}</p>
  </div>
</div>
    <h4 class="mb-0 mt-5">
      Vendor Name: {{CVES[0].affects.vendor.vendor_data[0].vendor_name}}</h4>
    <div>
      <h5 class="mb-3">{{CVES[0].description.description_data[0].value}}</h5>
      <h4 class="mt-5 mb-0">
        Versions
      </h4>
        <table class="table table-striped">
      <thead>
        <tr>
          <th scope="col">#</th>
          <th scope="col">Name</th>
          <th scope="col">Version</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(pd, index) in productData"
        :key="pd._id">
          <th scope="row">{{index + 1}}</th>
          <th>{{pd.product_name}}</th>
          <th v-if="pd.version.version_data.length <= 1"></th>
          <th v-else>
            <span v-for="vd in pd.version.version_data" :key="vd._id"
            class="badge badge-pill badge-light">{{vd.version_value}}</span>
          </th>
        </tr>
      </tbody>
    </table>
    </div>
    <p>{{CVES[0].problemtype}}</p>
    <table class="table table-striped">
      <thead>
        <tr>
          <th scope="col">#</th>
          <th scope="col">Name</th>
          <th scope="col">Source</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(ref, index) in CVES[0].references.reference_data" :key="ref._id">
          <th scope="row">{{index + 1}}</th>
          <th>
            <a v-bind:href="ref.url">{{ref.name}}</a>
          </th>
          <th>{{ref.refsource}}</th>
        </tr>
      </tbody>
    </table>
    <button type="button" v-on:click="this.$route.meta"
    class="btn btn-outline-danger btn-lg btn-block mb-3">Back</button>
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
        console.log(result);
      });
  },
  computed: {
    productData() {
      return this.CVES[0].affects.vendor.vendor_data[0].product.product_data;
    },
  },
};
</script>

<style>
</style>
