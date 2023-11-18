import { Tooltip as ReactTooltip } from 'react-tooltip'

interface Props {
  id: string
}

export default function Tooltip({ id }: Props) {
  return <ReactTooltip id={id} delayShow={400} />
}
