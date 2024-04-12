export const googleRecaptha = () => {
  grecaptcha
    .execute("6LcNdKMpAAAAAF3CPRcEzFBLPawEk92hLkBVQwWR", { action: "submit" })
    .then(function (token) {
      // Add token value to form
      document.getElementById("g-recaptcha-response").value = token;
    });
};
