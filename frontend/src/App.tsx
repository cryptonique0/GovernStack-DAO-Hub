import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Layout } from './components/Layout'
import { Dashboard } from './pages/Dashboard'
import { Proposals } from './pages/Proposals'
import { ProposalDetail } from './pages/ProposalDetail'
import { CreateProposal } from './pages/CreateProposal'
import { Treasury } from './pages/Treasury'
import { Staking } from './pages/Staking'
import { Governance } from './pages/Governance'
import { useWalletStore } from './stores/walletStore'

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/proposals" element={<Proposals />} />
          <Route path="/proposals/:id" element={<ProposalDetail />} />
          <Route path="/proposals/create" element={<CreateProposal />} />
          <Route path="/treasury" element={<Treasury />} />
          <Route path="/staking" element={<Staking />} />
          <Route path="/governance" element={<Governance />} />
        </Routes>
      </Layout>
    </Router>
  )
}

export default App
