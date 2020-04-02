import { ListItem } from './lisItem';

export const ListCategory = ({ name = '', category = [], filter}) => {
   return (
		<div id={name.replace(' ', '_')} className="relative py-5 category">
			<h1 className="category">
				{name}
			</h1>
			<div>
				{
               category.map(props => (
							<ListItem key={props.phone} {...props} />
						))
				}
			</div>
		</div>
	);
};
