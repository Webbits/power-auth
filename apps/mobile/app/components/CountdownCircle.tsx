import * as Progress from "react-native-progress"
import React, { useEffect, useState } from "react"
import { colors } from "app/theme"

const getMicrosecondsLeftFromNow = (deadline: Date) => {
  const epocExpiry = Math.floor(deadline.getTime())
  const epocNow = Math.floor(Date.now())

  return epocExpiry - epocNow
}

export function CountdownCircle({
  periodInSeconds,
  tokenValidTill,
}: {
  periodInSeconds: number
  tokenValidTill: Date
}) {
  const [microSecondsLeft, setMicroSecondsLeft] = useState<number>(0)

  const microSecondsPeriod = periodInSeconds * 1000
  const progressPercentage = 1 - (microSecondsLeft ? microSecondsLeft / microSecondsPeriod : 0)

  useEffect(() => {
    setMicroSecondsLeft(getMicrosecondsLeftFromNow(tokenValidTill))

    const intervalId = setInterval(() => {
      setMicroSecondsLeft(getMicrosecondsLeftFromNow(tokenValidTill))
    }, 100)
    return () => {
      clearInterval(intervalId)
    }
  }, [periodInSeconds, tokenValidTill])

  return (
    <>
      <Progress.Pie
        progress={progressPercentage}
        style={{ borderRadius: 0, borderWidth: 0, margin: 0 }}
        color={colors.palette.primary500}
        size={25}
        animated
      />
    </>
  )
}
