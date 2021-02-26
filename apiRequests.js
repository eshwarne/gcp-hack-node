

const getData = async () => {
  const response = await payViaBeneficiary(
    "CHARSID",
    "heheheheh",
    "" + 200,
    "" + 18,
    "" + 18,
    "hello"
  );
  console.log(response);
};

getData();
