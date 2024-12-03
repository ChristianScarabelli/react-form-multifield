import Card from './Card/Card.jsx'
import { posts } from '../data/posts.js'
import Tags from './Tags/Tags.jsx'
import { useState } from 'react'

export default function Main() {
    const uniqueTags = []
    for (const post of posts) { // per ogni post dell'array di oggetti posts
        for (const tag of post.tags) { // per ogni array di tags di ogni post
            if (!uniqueTags.includes(tag)) {
                uniqueTags.push(tag) // se il tag se non è già presente lo pusho
            }
        }
    }

    const [post, setPost] = useState(posts)  // variabile di stato per aggiungere un nuovo post all'array originale
    const [title, setTitle] = useState('')  // variabile per aggiungere il titolo del nuovo post
    const [author, setAuthor] = useState('')  // variabile per aggiungere il nome dell'autore
    const [workState, setWorkState] = useState(false)  // variabile per inserire lo stato di completamento dell'articolo

    // funzione per aggiungere il nuovo post (con le variabili di stato)
    function addNewPost(event) {        // disattivo la pagina che si aggiorna da sola
        event.preventDefault()

        if (!title.trim() || !author.trim()) return

        const newPost = {       // nuovo oggetto post
            id: Date.now(),
            title: title.trim(),
            author: author.trim(),
            image: undefined,
            content:
                'Lorem ipsum dolor sit amet consectetur adipisicing elit. Velit animi unde quasi enim non esse ratione voluptas voluptate, officiis veritatis magni blanditiis possimus nobis cum id inventore corporis deserunt hic.',
            tags: [],
            published: workState,
        }

        setPost([...post, newPost])     // aggiorno la variabile di stato con l'array originale e il nuovo post
        setTitle('')        // svuoto i campi dopo il submit
        setAuthor('')
        setWorkState(false)
    }

    // funzione per cancellare i post
    function deletePost(postId) {
        setPost((prevPosts) => prevPosts.filter((post) => post.id !== postId))  // prendo l'array di post e lo ritorno tutto tranne quello il cui id è diverso da quello cliccato
    }


    const publishedPosts = post.filter((post) => post.published) // meglio fare con filter, per fare poi meno iterazioni dopo
    return (
        <>
            <main>
                <section className='posts_section'>
                    <div className='container'>
                        <h1 className='page-title'>Il mio blog</h1>
                        <div className='tags_stripe'>
                            < Tags tags={uniqueTags} />
                        </div>
                        <form onSubmit={addNewPost} className='form'>
                            <input
                                type="text"
                                onChange={(event) => setTitle(event.target.value)}
                                placeholder='Nuovo titolo'
                                value={title} />
                            <input
                                type="text"
                                onChange={(event) => setAuthor(event.target.value)}
                                placeholder='Nome autore'
                                value={author} />
                            <select
                                className='select'
                                onChange={(event) => setWorkState(event.target.value === 'true')} // imposto il value come un valore boleano
                                value={workState ? 'true' : 'false'}  // imposto true o false come valori possibili della variabile di stato
                            >
                                <option value="true">Pubblicato</option>
                                <option value="false">Bozza</option>
                            </select>
                            <input className='submit' type="submit" value='Aggiungi' />
                        </form>
                    </div>
                    <div className='container'>
                        {publishedPosts.length ? ( // Se ci sono post
                            <div className="row">
                                {publishedPosts.map((post) =>
                                    <div key={post.id} className="col-6">
                                        <Card
                                            image={post.image}
                                            title={post.title}
                                            tags={post.tags}
                                            author={post.author}
                                            content={post.content}
                                            onDelete={() => deletePost(post.id)}
                                        />
                                    </div>
                                )}
                            </div>
                        ) : (
                            <p>No posts available</p> // Se l'array `posts` è vuoto
                        )}
                    </div>
                </section>
            </main>
        </>
    )
}