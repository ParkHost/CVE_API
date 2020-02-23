<template>
  <div>
    <div v-if="loading">
      <h2>Loading...</h2>
    </div>
    <form @submit.prevent="sendData" v-if="!loading">
      <div class="form-row align-items-center mt-2">
        <div class="col-6">
          <label class="sr-only" for="Search">Input</label>
          <input
            v-model="search.input"
            type="text"
            name="search"
            id="userInput"
            class="form-control"
            placeholder="Search"
            required
          />
        </div>
        <div class="col-4">
          <button type="submit" id="search" class="btn btn-secondary">Search</button>
        </div>
        <div class="col-2" v-if="count > 0">Total found: {{count}}</div>
      </div>
    </form>
    <div v-if="!loading">
      <div v-if="CVES.length === 1">
        <h5 v-if="CVES[0]._id">
          <router-link :to="{ path: 'byId', query: { id : CVES[0]._id}}">{{CVES}}</router-link>
        </h5>
      </div>
      <div class="mt-3" v-for="CVE in CVES" :key="CVE._id">
        <li class="media" v-if="CVE.references">
          <div class="media-body">
            <h5 class="mt-0 mb-1">
              <router-link :to="{ path: 'byId', query:
              { id : CVE._id}}">{{CVE.CVE_data_meta.ID}}</router-link>
            </h5>
            <h6 class="mt-0 mb-1">Assigned By: {{CVE.CVE_data_meta.ASSIGNER}}</h6>
            {{CVE.description.description_data[0].value}}
            <h6 class="mt-2 mb-1">References:</h6>
            <div>
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
                    <th v-if="index < 4">
                      <a v-bind:href="ref.url">{{ref.name}}</a>
                    </th>
                    <th v-if="index < 4">{{ref.refsource}}</th>
                  </tr>
                </tbody>
              </table>
            </div>
            <hr />
          </div>
        </li>
        <li class="media" v-else>
          <div class="media-body">
            <h5><router-link :to="{ path: 'byId', query:
              { id : CVE._id}}">{{CVE.CVE_data_meta.ID}}</router-link>
              is {{CVE.CVE_data_meta.STATE}}</h5>
            <hr />
          </div>
        </li>
      </div>
    </div>
    <div class="button-container">
      <button @click="loadMore" id="loadMoreButton" class="button-primary"
      >Load More</button>
    </div>
  </div>
</template>
<script>
const API_URL = 'http://localhost:3000/v2/messages';
const SEARCH_URL = 'http://localhost:3000/search';
const loadMoreButton = document.querySelector('#loadMoreButton');
let skip = 0;
const limit = 10;

export default {
  name: 'home',
  data: () => ({
    CVES: [],
    search: {
      input: '',
    },
    count: '',
    loading: false,
  }),
  mounted() {
    fetch(`${API_URL}?skip=${skip}&limit=${limit}`)
      .then(response => response.json())
      .then((result) => {
        console.log(result);
        this.CVES = result.cves;
      });
  },
  methods: {
    sendData() {
      this.loading = true;
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
          this.CVES = result;
          this.loading = false;
          if (this.CVES.length === 1) {
            /* eslint no-underscore-dangle: 0 */
            this.$router.push({ path: 'byId', query: { id: this.CVES[0]._id } });
          }
        });
    },
    listAllCVES() {
      fetch(`${API_URL}?skip=${skip}&limit=${limit}`)
        .then(response => response.json())
        .then((result) => {
          console.log(result.cves);
          this.CVES = this.CVES.concat(result.cves);
          this.loading = false;
          console.log(this.CVES);
        });
      loadMoreButton.style.visibility = 'visible';
    },
    loadMore() {
      skip += limit;
      this.listAllCVES();
    },
  },
  computed: {
    rows() {
      return this.CVES.length;
    },
  },
};
</script>

<style>
hr {
  border-top: 1px solid white;
}

.button-container {
  display: flex;
  justify-content: center;
  margin: 1em;
}
</style>
