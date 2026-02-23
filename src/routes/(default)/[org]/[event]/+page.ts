import type { PageLoad } from "./$types";

export const load: PageLoad = ({ params }) => {
  return {
    org: params.org,
    event: params.event,
  };
};
