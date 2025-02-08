<script lang="ts">
  import Icon from "@iconify/svelte";
  import Link from "$components/Link.svelte";
</script>

<div class="p-3 bg-secondary-500 text-center">
  <p>
    Made with <Icon icon="ph:heart-straight-fill" style="display: inline; color: #fb2c36" />
    <span class="line-through">and stack overflow</span>
    by
    <Link href="https://github.com/ThePoultryMan" class="text-blue-400">ThePoultryMan</Link>
  </p>
  <ul class="text-blue-400">
    <li><Link href="https://github.com/ThePoultryMan/lightboard">GitHub</Link></li>
  </ul>
</div>
