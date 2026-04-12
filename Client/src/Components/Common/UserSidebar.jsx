import { FaRegUser } from "react-icons/fa";
import { GrUserAdmin } from "react-icons/gr";

const UserSidebar = () => {
  return (
    <div>
        <div className="h-[50vh] p-3 space-y-2 w-60 dark:bg-[#BAD8B6] dark:text-gray-800 ">
	<div className="flex items-center p-2 space-x-4">
		<img src="https://source.unsplash.com/100x100/?portrait" alt="" className="w-12 h-12 rounded-full dark:bg-gray-500" />
		<div>
			<h2 className="text-lg font-semibold">Leroy Jenkins</h2>
		</div>
	</div>
	<div className="divide-y dark:divide-gray-300">
		<ul className="pt-2 pb-4 space-y-1 text-sm">
			<li className="dark:bg-gray-100 dark:text-gray-900">
				<a rel="noopener noreferrer" href="#" className="flex items-center p-2 space-x-3 rounded-md">
					<FaRegUser />
					<span>User Information</span>
				</a>
			</li>
			<li>
				<a rel="noopener noreferrer" href="#" className="flex items-center p-2 space-x-3 rounded-md">
					<GrUserAdmin />
					<span>Update Infromation</span>
				</a>
			</li>
			<li>
				<a rel="noopener noreferrer" href="#" className="flex items-center p-2 space-x-3 rounded-md">
					<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className="w-5 h-5 fill-current dark:text-gray-600">
						<path d="M440,424V88H352V13.005L88,58.522V424H16v32h86.9L352,490.358V120h56V456h88V424ZM320,453.642,120,426.056V85.478L320,51Z"></path>
						<rect width="32" height="64" x="256" y="232"></rect>
					</svg>
					<span>Logout</span>
				</a>
			</li>
		</ul>
	</div>
</div>
    </div>
  )
}

export default UserSidebar