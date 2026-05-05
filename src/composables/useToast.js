import { ref } from "vue";

const toastRef = ref(null);

export function useToast() {
  function success(message) {
    toastRef.value?.show(message, "success");
  }

  function error(message) {
    toastRef.value?.show(message, "error");
  }

  return { toastRef, success, error };
}
