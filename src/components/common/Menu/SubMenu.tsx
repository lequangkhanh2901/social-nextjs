import { twMerge } from 'tailwind-merge'
import SubMenuItem, { Props as ISubMenuItem } from './SubMenuItem'

export interface Props {
  menu: ISubMenuItem[]
  className?: string
  placement?: {
    x?: 'left' | 'center' | 'right'
    y?: 'top' | 'center' | 'bottom'
  }
}

export default function SubMenu({
  menu,
  className,
  placement = {
    x: 'right',
    y: 'bottom'
  }
}: Props) {
  const renderPositionClass = () => {
    let positionClass = ''
    if (placement.x === 'center') {
      positionClass += 'left-1/2 -translate-x-1/2 '
    } else if (placement.x === 'left') {
      positionClass += 'right-full '
    } else {
      positionClass += 'left-full '
    }

    if (placement.y === 'top') {
      positionClass += '-top-full '
    } else if (placement.y === 'center') {
      positionClass += 'top-1/2 -translate-y-1/2 '
    } else {
      positionClass += 'top-full '
    }

    return positionClass
  }

  return (
    <div
      className={twMerge(
        'absolute bg-common-white rounded p-1 shadow-lg w-[150px]',
        renderPositionClass(),
        className
      )}
    >
      {menu.map((item, index) => (
        <SubMenuItem
          key={index}
          handle={item.handle}
          label={item.label}
          className={item.className}
          requireConfirm={item.requireConfirm}
          confirmMessage={item.confirmMessage}
        />
      ))}
    </div>
  )
}
