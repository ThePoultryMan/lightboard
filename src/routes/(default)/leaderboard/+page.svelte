<script lang="ts">
  import { browser } from "$app/environment";
  import { goto } from "$app/navigation";
  import { sessionData, type EventCode } from "$lib/state";

  let eventCode: EventCode | undefined;
  sessionData.subscribe((data) => {
    if (browser) {
      if (data.eventCode) {
        eventCode = data.eventCode;
      } else {
        eventCode = {
          org: "example",
          event: "example-event-1",
        };
      }
      goto(`/${eventCode.org}/${eventCode.event}`);
    }
  });
</script>
