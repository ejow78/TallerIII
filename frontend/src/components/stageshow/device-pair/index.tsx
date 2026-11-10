import { LockScreen, Notification, Phone, Stage, Window, WALLPAPER } from '../kit'
import { OrdersMockView } from './OrdersMockView'
import './payments.css'

const WALL = WALLPAPER

function GmailIcon() {
  return (
    <svg viewBox="0 49.4 512 399.42" width="22" height="22" style={{ display: 'block' }}>
      <path fill="#4285f4" d="M34.91 448.818h81.454V251L0 163.727V413.91c0 19.287 15.622 34.91 34.91 34.91z" />
      <path fill="#34a853" d="M395.636 448.818h81.455c19.287 0 34.909-15.622 34.909-34.909V163.727L395.636 251z" />
      <path fill="#fbbc04" d="M395.636 99.727V251L512 163.727v-46.545c0-43.142-49.25-67.782-83.782-41.891z" />
      <path fill="#ea4335" d="M116.364 251V99.727L256 204.455 395.636 99.727V251L256 355.727z" />
      <path fill="#c5221f" d="M0 117.182v46.545L116.364 251V99.727L83.782 75.291C49.25 49.4 0 74.04 0 117.18z" />
    </svg>
  )
}

export default function PaymentsStatic() {
  return (
    <Stage
      width={820}
      height={560}
      fill
      theme="dark"
      accent="#4ca5ff"
      compact={{ below: 640, width: 360, height: 355 }}
      className="ps-section"
    >
      {(_s, _rect, layout) => (
        <>
          <Window url="app.repairit.cloud" urlShape="pill" className="ps-window">
            <div className="ps-mock-container dark">
              <OrdersMockView />
            </div>
          </Window>

          <Phone width={layout === 'compact' ? 162 : 275} frame="pro" dark time="09:09" wallpaper={WALL} className="ps-phone">
            <LockScreen date="Martes, 10 de Noviembre" time="09:09" size="satellite" stack="top">
              <Notification
                icon={
                  <span className="ps-gmail-icon">
                    <GmailIcon />
                  </span>
                }
                title="RepairIT"
                body={
                  <>
                    Recibimos tu equipo en el taller
                    <br />
                    RT-RAPKTXBH
                  </>
                }
              />
            </LockScreen>
          </Phone>
        </>
      )}
    </Stage>
  )
}
