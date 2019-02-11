Vue.component('modal', {
    template: '#modal-template'
});
const app = new Vue({
    el: '#app',
    created: function () {
        return fetch("storage/storage.json")
            .then(response => response.json())
            .then(data => app.products = data);
    },
    data: {
        products: [],
        message: 'Savings calculator',
        newSaving: {
            fund: '',
            oneTimeInvestment: '',
            totalIncome: '',
            netIncome: '',
            interestIncome: '',
            taxes: '',
            years: '',
            email: ''
        },
        calculated: false,
        appliedSavings: [],
        selectedSaving: '',
        showModal: false,
        // appliedSavings: [{
        //     email: "skarbala.martin@gmail.com",
        //     oneTimeInvestment: 5000,
        //     selectedFund: {
        //         name: "Fellowship investment group",
        //         risk: "Medium"
        //     },
        //     totalIncome: 5304.5,
        //     netIncome: 304.5,
        //     years: 2,
        //     taxes:50
        //
        //
        // }],

    },
    computed: {
        savingButtonDisabled: function () {
            return !(
                this.newSaving.fund &&
                this.newSaving.oneTimeInvestment &&
                this.newSaving.years &&
                this.newSaving.email
            );
        }
    },


    methods: {
        calculate: function () {
            if (validate(this.newSaving)) {
                this.newSaving.totalIncome = calculateFinalSaving(
                    this.newSaving.oneTimeInvestment,
                    this.newSaving.fund.interestRate,
                    this.newSaving.years
                );

                this.newSaving.interestIncome =
                    this.newSaving.totalIncome -
                    this.newSaving.oneTimeInvestment;

                this.newSaving.taxes = calculateTaxes(this.newSaving.interestIncome);
                this.newSaving.netIncome = this.newSaving.totalIncome -
                    this.newSaving.taxes;
                this.calculated = true;
            }
        },
        applyForSaving: function () {
            if (validate(this.newSaving)) {
                const configurationToAdd = {
                    selectedFund: this.newSaving.fund,
                    years: this.newSaving.years,
                    oneTimeInvestment: this.newSaving.oneTimeInvestment,
                    totalIncome: this.newSaving.totalIncome,
                    email: this.newSaving.email,
                    netIncome: this.newSaving.netIncome,
                    taxes: this.newSaving.taxes,
                    interestIncome: this.newSaving.interestIncome,
                };
                this.appliedSavings.unshift(configurationToAdd);

                this.newSaving.fund = '';
                this.newSaving.oneTimeInvestment = '';
                this.newSaving.years = '';
                this.newSaving.totalIncome = '';
                this.newSaving.netIncome = '';
                this.newSaving.interestIncome = '';
                this.newSaving.taxes = '';
                this.newSaving.email = '';
                this.calculated = false;
            }

        },
        round: function (input) {
            return Math.round(input * 100) / 100
        },
        format: function (number) {
            return parseFloat(number).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1 ');

        },
        openDetail: function (saving) {
            this.selectedSaving = saving;
            this.showModal = true;
        }
    }
});


function validate(newSaving) {
    return (newSaving.fund && newSaving.oneTimeInvestment && newSaving.years);
}

function calculateFinalSaving(initialInvestment, interestRate, years) {
    return initialInvestment * Math.pow(1 + (+interestRate / 100), +years)
}

function calculateTaxes(input) {
    return input * 0.19;
}
