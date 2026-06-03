

<script setup lang="ts">
import { onMounted, ref } from 'vue';

const hash: string | undefined = import.meta.env.VITE_GIT_HASH;
const baseUrl = 'https://github.com/jim60105/UnfairSpinWheel';
const version = ref('v.DEVELOP');
const url = ref(baseUrl);
const privacyUrl = baseUrl + '/blob/master/privacy-policy.md';

onMounted(() => {
  if (hash) {
    version.value = 'v.' + hash.substring(0, 7).toUpperCase();
    url.value = `${baseUrl}/tree/${hash}`;
  }
});
</script>

<style scoped lang="scss">
footer {
  font-family: var(--font-family);

  background-image: linear-gradient(to right, rgba(31, 35, 40, 0.7) 0%, transparent 55%);
  font-size: 0.6rem;
}
</style>
