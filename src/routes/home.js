import { Component, Fragment } from 'preact';

import { ListCategory } from '../components/listCategory';
import {Link} from "preact-router/match";
import Constants from "../constants";

export default class Home extends Component {
	state = {
		filter: '',
      isHomepage: true
	};

	handleChangeFilter = e => {
		const text = e.target.value;
		this.setState({ filter: text });
	};

	filteredCategories(filter) {
      const { results } = this.props;
      let filtered_results = results.filter(item => {
         console.log(item.name, item.category, item.status);
         return (
            item.name.toUpperCase().includes(filter.toUpperCase()) ||
            item.category.toUpperCase().includes(filter.toUpperCase())
         ) && item.status;
      });


      let grouped_results = filtered_results.reduce(function(results, item) {
         (results[item.category] = results[item.category] || []).push(item);
         return results;
      }, {});

      console.log(grouped_results);


      /* let items = results;

       let toret = {};

       Object.keys(items).forEach(key => {
          toret[key] = {data: items[key].filter(item => {
                return (
                   item.name.toUpperCase().includes(filter.toUpperCase()) ||
                      item.cat.toUpperCase().includes(filter.toUpperCase())
                ) && item.status === 'ok';
             })}
       });

 */


      return grouped_results;
	}

	render(props, { filter, isHomepage }) {
		const stores = this.filteredCategories(filter);

		return (
			<Fragment>
            <div class="mobile-buttons">
               <Link href='/iniziativa'><img src="assets/icons/info.svg" class="info"/></Link>
               <a className="btn btn-blue" target="_blank" rel='noopener'
                  href="https://bit.ly/fiumicinoadomicilio">Aggiungi un'attività</a>
            </div>
            <img alt={"Fiumicino a Domicilio"} className={'logo'} src="assets/logo.svg"/>
            <p class="main-description">Registrazione gratuita per sempre.<br/>Aiutiamoci in questo momento di difficoltà :)</p>
					<input
						class="search"
						type="text"
						placeholder="Cosa stai cercando?"
						onInput={this.handleChangeFilter}
					/>
            <nav className="buttons">
               <Link class="btn btn-gray"
                     href="/iniziativa">A proposito dell'iniziativa</Link>
               <a class="btn btn-blue" target="_blank" rel='noopener'
                     href="https://bit.ly/fiumicinoadomicilio">Aggiungi un'attività</a>
            </nav>
				<div class="relative mb-10 font-sans text-md text-gray-800">
               <div class="categories">
					{
						Object.keys(stores) && Object.keys(stores)
							.filter(key => stores[key].length)
							.map(key => (
								<ListCategory
									name={key}
									category={stores[key]}
									filter={filter}
								/>
							))
					}
               </div>
				</div>

            <div className="footer">
               <img className="logo" src="assets/footer-logo.svg"/>
               <p className="mb-5 text-center">Realizzato da cittadini di Fiumicino per i cittadini di Fiumicino | da un'
                  idea di <a href='http://tomma5o.com/' target='_blank'>Tomma5o</a></p>
               <p><a href="https://www.iubenda.com/privacy-policy/83882923" className="iubenda-white iubenda-embed"
                     title="Privacy Policy ">Privacy Policy</a>
               </p>
               <p style="opacity: 0.2; margin-top: 15px;">
                  v{Constants.VERSION}
               </p>
            </div>

			</Fragment>
		);
	}
}
