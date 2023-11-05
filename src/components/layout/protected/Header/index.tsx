import Logo from '~/components/common/Logo'
import Navigate from './Navigate'
import Menu from './Menu'
import SearchBox from './SearchBox'

export default function Header() {
  return (
    <header className="justify-between items-center py-1 grid grid-cols-11 gap-3 shadow-[0_2px_4px_#00000020] z-10 sticky top-0 bg-common-white">
      <div className="col-span-1">
        <Logo />
      </div>
      <SearchBox />
      <div className="col-span-5">
        <Navigate />
      </div>
      <div className="col-span-3">
        <Menu />
      </div>
    </header>
  )
}
