<template>
  <Index  ref="Index"></Index>  
</template>

<script>
import Index from '@/components/category-node/index.vue'

export default {
  data() {
    return {      
    };
  },
  activated() {
    this.init(null)
  },
  components: {
      Index
    },
  methods: {
    init(id) {
      this.$refs.Index.init(id, 'bizflow')      
    }      
  }
};
</script>