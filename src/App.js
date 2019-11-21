import React from 'react';
import './App.css';

export default class Main extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			input: '',
			suggestion: [],
			countries: [],
			selected: false
		};
		this.handleChange = this.handleChange.bind(this);
	}

	componentDidMount() {
		const url = 'https://restcountries.eu/rest/v2/all';
		let countries;
		fetch(url).then((res) =>
			res.json().then((data) => {
				this.setState({ countries: data });
				// console.log('tempTab', this.state.countries);
			})
		);
	}

	handleChange(e) {
		const { countries, input } = this.state;
		e.preventDefault();
		let value = e.target.value;
		if (value.length === 0 || value.length < 2) {
			this.setState({ selected: false });
			console.log('value', value.length);
		}
		let suggestion = [];
		const newCount = countries.map((el) => el.name);
		if (value.length > 0) {
			const regex = new RegExp(`^${value}`, 'i');
			suggestion = newCount.sort().filter((v) => regex.test(v));
		}
		this.setState({ [e.target.name]: value, suggestion });
	}

	renderSuggestion() {
		const { suggestion, input, countries, selected } = this.state;
		if (suggestion.length === 0) {
			return null;
		}

		return (
			<div>
				{suggestion.map((el, i) => (
					<li style={{ cursor: 'pointer' }} onClick={() => this.selectedSuggestion(el)} key={i}>
						{el}
					</li>
				))}
			</div>
		);
	}

	selectedSuggestion(selection) {
		const { input, suggestion } = this.state;
		this.setState({ input: selection, suggestion: [], selected: true });
	}

	render() {
		const { input, countries, selected, suggestion } = this.state;
		const { handleChange } = this;
		const countryFilter = (country) => country.name.toLowerCase().includes(input.toLowerCase());

		//console.log('countries', countries);
		console.log('SELECTED', selected);
		return (
			<div className="tab">
				<h1>Hello world!</h1>
				<h5>Search your country</h5>
				<br />
				<input name="input" onChange={handleChange} value={input} />
				<br />
				{this.renderSuggestion()}
				{selected === true ? (
					countries.filter(countryFilter).map((country, i) => {
						let pop = country.population;
						let newPop = pop.toLocaleString('fr-FR');
						if (country.capital === '') {
							return null;
						}
						return (
							<div key={i}>
								<br />

								<div className="card">
									<img src={country.flag} alt="img" className="img-flag" />
									<div className="card-body">
										<p className="card-text">
											Pays: {country.name}, {country.altSpellings[2]}
											<br />
											Capital du pays : {country.capital}
											<br />
											Nombre d'habitant: {newPop} d'habitants
											<br />
											Region:{country.region}
											<br />
											Region:{country.subregion}
										</p>
									</div>
								</div>
							</div>
						);
					})
				) : null}
			</div>
		);
	}
}
