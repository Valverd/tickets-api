'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {

    let room_ids = [1, 2, 3, 4, 5, 6]

    await queryInterface.bulkInsert("Prices", [
      {
        price: 10,
        name: "Meia Normal"
      },
      {
        price: 20,
        name: "Inteira Normal"
      },
      {
        price: 25,
        name: "Meia VIP"
      },
      {
        price: 50,
        name: "Meia VIP"
      },
    ])

    await queryInterface.bulkInsert("Movies", [
      {
        name: "Capitão América: Admirável Mundo Novo",
        tickets_number: 10,
        description: "Em CAPITÃO AMÉRICA: ADMIRÁVEL MUNDO NOVO, após a eleição de Thaddeus Ross como presidente dos Estados Unidos, Sam Wilson se encontra no meio de um incidente internacional e deve trabalhar para deter os verdadeiros cérebros por trás dele.",
        age_group: 12,
        duration: "01:59:00"
      },
      {
        name: "Chico Bento E A Goiabeira Maraviosa",
        tickets_number: 10,
        description: "Chico Bento precisa unir toda sua turma para 'sarvá' a goiabeira do Nhô Lau.",
        age_group: 0,
        duration: "01:41:00"
      },
      {
        name: "Ainda Estou Aqui",
        tickets_number: 10,
        description: "Em CAPITÃO AMÉRICA: ADMIRÁVEL MUNDO NOVO, após a eleição de Thaddeus Ross como presidente dos Estados Unidos, Sam Wilson se encontra no meio de um incidente internacional e deve trabalhar para deter os verdadeiros cérebros por trás dele.",
        age_group: 14,
        duration: "02:16:00"
      },
      {
        name: "Mufasa: O Rei Leão",
        tickets_number: 10,
        description: "Mufasa: O Rei Leão contará a história de Mufasa e Scar antes de Simba. A trama tem a ajuda de Rafiki, Timão e Pumba, que juntos contam a lenda de Mufasa à jovem filhote de leão Kiara, filha de Simba e Nala. Narrado através de flashbacks, a história apresenta Mufasa como um filhote órfão, perdido e sozinho até que ele conhece um simpático leão chamado Taka – o herdeiro de uma linhagem real. O encontro ao acaso dá início a uma grande jornada de um grupo extraordinário de deslocados em busca de seu destino, além de revelar a ascensão de um dos maiores reis das Terras do Orgulho.",
        age_group: 10,
        duration: "01:58:00"
      },
    ])

  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
