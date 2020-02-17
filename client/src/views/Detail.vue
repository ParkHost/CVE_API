<template>
<div>
  <h5>Testing page
    {{CVES}}
  </h5>
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
      });
  },
};
</script>

<style>

</style>
