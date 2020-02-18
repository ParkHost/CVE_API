<template>
  <div>
    <form @submit.prevent="sendData">
      <div class="form-row align-items-center mt-2">
        <div class="col-6">
          <label class="sr-only" for="Search">Input</label>
          <input v-model="search.input" type="text" name="search"
          id="userInput" class="form-control"
          placeholder="Search" required />
        </div>
        <div class="col-4">
          <button type="submit" id="search" class="btn btn-secondary"
          >Search</button>
        </div>
        <div class="col-2" v-if="count > 0" >Total found: {{count}}</div>
      </div>
    </form>

    <div class="mt-3" v-for="CVE in reversed" :key="CVE._id">
      <li class="media" v-if="CVE.references">
        <div class="media-body">
          <h5 class="mt-0 mb-1">
            <router-link :to="{ path: 'byId', query: { id : CVE._id}}">
            {{CVE.CVE_data_meta.ID}}</router-link>
            <!-- <a :href="'http://localhost:3000/byId?id=' + CVE._id" @click="byId">
          {{CVE.CVE_data_meta.ID}}</a> -->
          </h5>
          <h6 class="mt-0 mb-1">Assigned By: {{CVE.CVE_data_meta.ASSIGNER}}</h6>
          {{CVE.description.description_data[0].value}}
          <h6 class="mt-2 mb-1">References:</h6>
          <div >
            <table class="table table-striped">
              <thead>
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">Name</th>
                  <th scope="col">Source</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(ref, index) in CVE.references.reference_data" :key="ref._id">
                  <th v-if="index < 4" scope="row">{{index + 1}}</th>
                  <th v-if="index < 4"><a v-bind:href="ref.url">{{ref.name}}</a></th>
                  <th v-if="index < 4">{{ref.refsource}}</th>
                </tr>
              </tbody>
            </table>
          </div>
          <hr />
        </div>
      </li>
    </div>
  </div>
</template>
<script>
const API_URL = 'http://localhost:3000/messages';
const SEARCH_URL = 'http://localhost:3000/search';

export default {
  name: 'home',
  data: () => ({
    perPage: 5,
    currentPage: 1,
    CVES: [],
    search: {
      input: '',
    },
    count: '',
  }),
  mounted() {
    fetch(API_URL)
      .then(response => response.json())
      .then((result) => {
        this.CVES = result;
      });
  },
  methods: {
    sendData() {
      this.CVES = [];
      const options = {
        method: 'POST',
        body: JSON.stringify(this.search),
        headers: {
          'content-type': 'application/json',
        },
      };
      fetch(SEARCH_URL, options)
        .then(response => response.json())
        .then((result) => {
          console.log(result);
          this.CVES = result.search;
          this.count = result.total;
        });
    },
  },
  computed: {
    rows() {
      return this.CVES.length;
    },
    reversed() {
      return this.CVES.slice().reverse();
    },
  },
};
</script>

<style>
hr {
  border-top: 1px solid white;
}
</style>
