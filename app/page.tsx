'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import ThemeSwitcher from "@/components/ThemeSwitcher"
import Link from 'next/link'
import { Plus, MessageSquare, LogOut, LogIn, Search, Filter, SortAsc, SortDesc } from 'lucide-react'
import { v4 as uuidv4 } from 'uuid'
import RotatedText from '@/components/RotatedText'

type Debate = {
  id: string
  title: string
  sideOne: string
  sideTwo: string
  createdAt: number
  createdBy: string
  participants: number
}

type User = {
  id: string
  email: string
  name: string
}

export default function Component() {
  const [debates, setDebates] = useState<Debate[]>([])
  const [filteredDebates, setFilteredDebates] = useState<Debate[]>([])
  const [newDebate, setNewDebate] = useState({
    title: '',
    sideOne: '',
    sideTwo: ''
  })
  const [user, setUser] = useState<User | null>(null)
  const [authForm, setAuthForm] = useState({
    email: '',
    password: '',
    name: ''
  })
  const [isAuthDialogOpen, setIsAuthDialogOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')

  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      setUser(JSON.parse(storedUser))
      fetchDebates()
    } else {
      fetchPublicDebates()
    }
  }, [])

  useEffect(() => {
    const filtered = debates.filter(debate =>
      debate.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      debate.sideOne.toLowerCase().includes(searchTerm.toLowerCase()) ||
      debate.sideTwo.toLowerCase().includes(searchTerm.toLowerCase())
    )
    const sorted = filtered.sort((a, b) => 
      sortOrder === 'asc' ? a.createdAt - b.createdAt : b.createdAt - a.createdAt
    )
    setFilteredDebates(sorted)
  }, [debates, searchTerm, sortOrder])

  const fetchDebates = () => {
    const storedDebates = localStorage.getItem('debates')
    if (storedDebates) {
      setDebates(JSON.parse(storedDebates))
    }
  }

  const fetchPublicDebates = () => {
    const publicDebates: Debate[] = [
      {
        id: '1',
        title: 'Climate Change Solutions',
        sideOne: 'Renewable Energy',
        sideTwo: 'Nuclear Power',
        createdAt: Date.now() - 86400000,
        createdBy: 'system',
        participants: 15
      },
      {
        id: '2',
        title: 'Education Reform',
        sideOne: 'Traditional Schooling',
        sideTwo: 'Homeschooling',
        createdAt: Date.now() - 172800000,
        createdBy: 'system',
        participants: 8
      },
      {
        id: '3',
        title: 'Space Exploration',
        sideOne: 'Government Agencies',
        sideTwo: 'Private Companies',
        createdAt: Date.now() - 259200000,
        createdBy: 'system',
        participants: 12
      }
    ]
    setDebates(publicDebates)
  }

  const handleCreateDebate = () => {
    if (newDebate.title && newDebate.sideOne && newDebate.sideTwo && user) {
      const debate: Debate = {
        id: uuidv4(),
        ...newDebate,
        createdAt: Date.now(),
        createdBy: user.id,
        participants: 0
      }
      const updatedDebates = [...debates, debate]
      setDebates(updatedDebates)
      localStorage.setItem('debates', JSON.stringify(updatedDebates))
      setNewDebate({ title: '', sideOne: '', sideTwo: '' })
    }
  }

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault()
    const newUser: User = { id: uuidv4(), email: authForm.email, name: authForm.email.split('@')[0] }
    setUser(newUser)
    localStorage.setItem('user', JSON.stringify(newUser))
    fetchDebates()
    setIsAuthDialogOpen(false)
  }

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault()
    const newUser: User = { id: uuidv4(), email: authForm.email, name: authForm.name }
    setUser(newUser)
    localStorage.setItem('user', JSON.stringify(newUser))
    setIsAuthDialogOpen(false)
  }

  const handleSignOut = () => {
    setUser(null)
    localStorage.removeItem('user')
    fetchPublicDebates()
  }

  const toggleSortOrder = () => {
    setSortOrder(prevOrder => prevOrder === 'asc' ? 'desc' : 'asc')
  }

  return (
    <main className="min-h-screen p-8 ">
      <div className="max-w-full mx-auto">
        <header className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
          <RotatedText className="bg-gradient-to-br from-[#5A67D8] via-[#7A77D8] to-[#DD3CBE]" tilt='right'>Lets'fight Dashboard</RotatedText>
          <div className="flex items-center space-x-4">
            <ThemeSwitcher />
            {user ? (
              <>
                <span>Welcome, {user.name}</span>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="mr-2 h-4 w-4" /> Create New Debate
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Create a New Debate</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid gap-2">
                        <Label htmlFor="title">Debate Title</Label>
                        <Input
                          id="title"
                          value={newDebate.title}
                          onChange={(e) => setNewDebate(prev => ({ ...prev, title: e.target.value }))}
                          placeholder="Enter debate title"
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="sideOne">Side One</Label>
                        <Input
                          id="sideOne"
                          value={newDebate.sideOne}
                          onChange={(e) => setNewDebate(prev => ({ ...prev, sideOne: e.target.value }))}
                          placeholder="Enter side one"
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="sideTwo">Side Two</Label>
                        <Input
                          id="sideTwo"
                          value={newDebate.sideTwo}
                          onChange={(e) => setNewDebate(prev => ({ ...prev, sideTwo: e.target.value }))}
                          placeholder="Enter side two"
                        />
                      </div>
                    </div>
                    <Button onClick={handleCreateDebate}>Create Debate</Button>
                  </DialogContent>
                </Dialog>
                <Button variant="outline" onClick={handleSignOut}>
                  <LogOut className="mr-2 h-4 w-4" /> Sign Out
                </Button>
              </>
            ) : (
              <Button onClick={() => setIsAuthDialogOpen(true)}>
                <LogIn className="mr-2 h-4 w-4" /> Login
              </Button>
            )}
          </div>
        </header>
        <div className="mb-6 flex flex-col sm:flex-row gap-4 items-center">
          <div className="relative flex-grow">
            <Input
              type="text"
              placeholder="Search debates..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
          <Button onClick={toggleSortOrder} variant="outline">
            {sortOrder === 'asc' ? <SortAsc className="mr-2 h-4 w-4" /> : <SortDesc className="mr-2 h-4 w-4" />}
            Sort by Date
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDebates.map(debate => (
            <Card key={debate.id} className="flex flex-col h-full">
              <CardHeader className="flex-grow">
                <CardTitle className="text-xl">{debate.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-2">
                  {debate.sideOne} vs {debate.sideTwo}
                </p>
                <p className="text-sm text-muted-foreground">
                  Created: {new Date(debate.createdAt).toLocaleDateString()}
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  Participants: {debate.participants}
                </p>
              </CardContent>
              <CardFooter className="mt-auto">
                <Link href={`/debate/${debate.id}`} passHref className="w-full">
                  <Button variant="outline" className="w-full">
                    <MessageSquare className="mr-2 h-4 w-4" /> Join Debate
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
      <Dialog open={isAuthDialogOpen} onOpenChange={setIsAuthDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Welcome to Debate Dashboard</DialogTitle>
          </DialogHeader>
          <Tabs defaultValue="signin" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="signin">Sign In</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>
            <TabsContent value="signin">
              <form onSubmit={handleSignIn} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="m@example.com"
                    required
                    value={authForm.email}
                    onChange={(e) => setAuthForm(prev => ({ ...prev, email: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    required
                    value={authForm.password}
                    onChange={(e) => setAuthForm(prev => ({ ...prev, password: e.target.value }))}
                  />
                </div>
                <Button type="submit" className="w-full">Sign In</Button>
              </form>
            </TabsContent>
            <TabsContent value="signup">
              <form onSubmit={handleSignUp} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    placeholder="John Doe"
                    required
                    value={authForm.name}
                    onChange={(e) => setAuthForm(prev => ({ ...prev, name: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="m@example.com"
                    required
                    value={authForm.email}
                    onChange={(e) => setAuthForm(prev => ({ ...prev, email: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    required
                    value={authForm.password}
                    onChange={(e) => setAuthForm(prev => ({ ...prev, password: e.target.value }))}
                  />
                </div>
                <Button type="submit" className="w-full">Sign Up</Button>
              </form>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </main>
  )
}