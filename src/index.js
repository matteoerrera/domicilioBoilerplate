import {h, Component, Fragment} from 'preact';
import { Router } from 'preact-router';
import { createHashHistory } from 'history';
import { Link } from 'preact-router/match';

import 'tailwindcss/dist/tailwind.min.css';
import './style.css';

// Code-splitting is automated for routes
import Home from './routes/home.js';
import Form from './routes/form.js';

// Constants
const SEARCH = process.env.PREACT_APP_DATA_SOURCE;

export default class App extends Component {

	state = {
		results: [],
		isHomepage: true,
	}
	
	handleRoute = e => {
		this.currentUrl = e.url;
		this.setState({isHomepage: e.url === "/"});
	};

	componentDidMount() {
		fetch(
			`${SEARCH}`
		)
			.then(r => r.json())
			.then(json => {
			   let entries = json.feed.entry;
            let items = entries.reduce(function(results, item) {
               (results[item.gs$cell.row] = results[item.gs$cell.row] || []).push(item);
               return results;
            }, {});
            delete items[1];

            let parsed_items = [];

            Object.keys(items).forEach(row => {
               let parsed_item = items[row].map(cell => {
                  return {
                     col: cell.gs$cell.col,
                     content: cell.content.$t,
                  }
               });

               let result = {};
               for (let i = 0; i < parsed_item.length; i++) {
                  result[parsed_item[i].col] = parsed_item[i].content;
               }


               parsed_items.push(result);
            });


            let activities = this.parseActivity(parsed_items);


				this.setState({
					results: activities,
					resultBkp: json
				});

			});
	}

	parseActivity(data) {
	   console.log(data);
      return data.map(row => {
         let activity = {
            category: this.getRowValue(row,1),
            name: this.getRowValue(row,2),
            location: this.getRowValue(row,3),
            address: this.getRowValue(row,4),
            phone: this.getRowValue(row,5),
            email: this.getRowValue(row,6),
            description: this.getRowValue(row,7),
            website: this.getRowValue(row,8),
            facebook: this.getRowValue(row,9),
            instagram: this.getRowValue(row,10),
            open: this.getRowValue(row,11, 'bool'),
            opening_days: this.getRowValue(row,12, 'array'),
            opening_hours: this.getRowValue(row,13),
            delivery: {
               enabled: this.getRowValue(row, 14, 'bool'),
               location: this.getRowValue(row, 15),
               hours: this.getRowValue(row, 16),
               shipment_price: this.getRowValue(row, 17),
               minimum_order: this.getRowValue(row, 18),
               payment_method: this.getRowValue(row, 19),
               booking_preference: this.getRowValue(row, 22),
            },
            tag: this.getRowValue(row, 20, 'array'),
            picture: this.getRowValue(row, 23),
            status: this.getRowValue(row, 26) === 'OK',
         };

         return activity;
      });
   }


   getRowValue(row, id, output) {
	   if(row[id]) {
	      let value = row[id];
	      switch (output) {
            case 'bool':
               return value.toLowerCase() === 'true';
            case 'array':
               return value.split(",");
            default:
               return value;
         }
      } else {
	      return null;
      }

   }


	render(props, { isHomepage, results }) {
		return (
			<div id="app" class="px-5 max-w-screen-md mx-auto">
            <div>
				<Router history={createHashHistory()} onChange={this.handleRoute}>
					<Home path="/" results={results} />
					<Form path="/iniziativa" />
				</Router>
            </div>

			</div>
		);
	}
}
