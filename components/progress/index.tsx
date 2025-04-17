import clsx from "clsx"
import s from "./progress.module.scss"

interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number
  max: number
}

export const Progress = ({ value, max, ...props }: ProgressProps) => {
  return (
    <div {...props} className={clsx(s.progress, props.className)}>
      <div
        className={s.progressBar}
        style={{ width: `${(value / max) * 100}%` }}
      />
    </div>
  )
}
