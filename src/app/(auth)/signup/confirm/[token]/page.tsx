import ConfirmSignup from '~/components/pages/auth/ConfirmSignup'

export default function ConfirmSignupPage({
  params: { token }
}: {
  params: {
    token: string
  }
}) {
  return <ConfirmSignup token={token} />
}
