export const navigation = [
	{
		label: 'nav.hero',
		section: 'hero',
		path: '/'
	},
	{
		label: 'nav.about',
		section: 'about',
		path: '/about'
	},
	{
		label: 'nav.projects',
		section: 'projects',
		path: '/projects'
	},
	{
		label: 'nav.game_dev',
		section: 'game_dev',
		path: '/game_dev'
	},
	{
		label: 'nav.contact',
		section: 'contact',
		path: '/contact'
	}
];

export function getSectionByPath(pathname) {
	return navigation.find((item) => item.path === pathname)?.section;
}
