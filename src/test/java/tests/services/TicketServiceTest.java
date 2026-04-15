package tests.services;

import com.example.demo.dto.TicketCreateDto;
import com.example.demo.dto.TicketDisplayDto;
import com.example.demo.entities.Flight;
import com.example.demo.entities.Ticket;
import com.example.demo.exception.ResourceNotFoundException;
import com.example.demo.mapper.TicketMapper;
import com.example.demo.repository.FlightRepository;
import com.example.demo.repository.TicketRepository;

import com.example.demo.service.TicketService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import org.mockito.*;
import org.mockito.junit.jupiter.MockitoExtension;

import org.springframework.data.domain.*;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class TicketServiceTest {

    @Mock
    private TicketRepository ticketRepository;

    @Mock
    private FlightRepository flightRepository;

    @Mock
    private TicketMapper ticketMapper;

    @InjectMocks
    private TicketService ticketService;

    private Ticket ticket;
    private Flight flight;
    private TicketCreateDto createDto;
    private TicketDisplayDto displayDto;

    @BeforeEach
    void setup() {
        ticket = new Ticket();
        ticket.setId(1L);

        flight = new Flight();
        flight.setId(10L);

        createDto = new TicketCreateDto();
        createDto.setPassengerName("John");
        createDto.setPassportNumber("ABC123");
        createDto.setSeat("12A");
        createDto.setPrice(100.0);

        displayDto = new TicketDisplayDto();
    }

    @Test
    void createTicket_success() {
        when(flightRepository.findById(10L)).thenReturn(Optional.of(flight));
        when(ticketMapper.toEntity(createDto, flight)).thenReturn(ticket);
        when(ticketRepository.save(ticket)).thenReturn(ticket);
        when(ticketMapper.toDisplayDto(ticket)).thenReturn(displayDto);

        TicketDisplayDto result = ticketService.createTicket(createDto, 10L);

        assertNotNull(result);
        verify(flightRepository).findById(10L);
        verify(ticketRepository).save(ticket);
        verify(ticketMapper).toDisplayDto(ticket);
    }

    @Test
    void createTicket_flightNotFound() {
        when(flightRepository.findById(10L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class,
            () -> ticketService.createTicket(createDto, 10L));

        verify(ticketRepository, never()).save(any());
    }

    @Test
    void getTicketsByFlightId_success() {
        Pageable pageable = PageRequest.of(0, 5);
        Page<Ticket> page = new PageImpl<>(java.util.List.of(ticket));

        when(ticketRepository.findByFlightFlightId(10L, pageable)).thenReturn(page);

        Page<Ticket> result = ticketService.getTicketsByFlightId(10L, pageable);

        assertEquals(1, result.getTotalElements());
    }

    @Test
    void getTicketsByFlightIdNative_success() {
        Pageable pageable = PageRequest.of(0, 5);
        Page<Ticket> page = new PageImpl<>(java.util.List.of(ticket));

        when(ticketRepository.findByFlightFlightIdNative(10L, pageable)).thenReturn(page);

        Page<Ticket> result = ticketService.getTicketsByFlightIdNative(10L, pageable);

        assertEquals(1, result.getTotalElements());
    }

    @Test
    void updateTicket_success() {
        when(ticketRepository.findById(1L)).thenReturn(Optional.of(ticket));
        when(flightRepository.findById(10L)).thenReturn(Optional.of(flight));
        when(ticketRepository.save(ticket)).thenReturn(ticket);
        when(ticketMapper.toDisplayDto(ticket)).thenReturn(displayDto);

        TicketDisplayDto result = ticketService.updateTicket(1L, createDto, 10L);

        assertNotNull(result);
        assertEquals("John", ticket.getPassengerName());
        assertEquals("ABC123", ticket.getPassportNumber());
        assertEquals("12A", ticket.getSeat());
        assertEquals(100.0, ticket.getPrice());
        assertEquals(flight, ticket.getFlight());

        verify(ticketRepository).save(ticket);
    }

    @Test
    void updateTicket_ticketNotFound() {
        when(ticketRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class,
            () -> ticketService.updateTicket(1L, createDto, 10L));
    }

    @Test
    void updateTicket_flightNotFound() {
        when(ticketRepository.findById(1L)).thenReturn(Optional.of(ticket));
        when(flightRepository.findById(10L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class,
            () -> ticketService.updateTicket(1L, createDto, 10L));
    }

    @Test
    void deleteTicket_success() {
        when(ticketRepository.existsById(1L)).thenReturn(true);

        ticketService.deleteTicket(1L);

        verify(ticketRepository).deleteById(1L);
    }

    @Test
    void deleteTicket_notFound() {
        when(ticketRepository.existsById(1L)).thenReturn(false);

        assertThrows(ResourceNotFoundException.class,
            () -> ticketService.deleteTicket(1L));

        verify(ticketRepository, never()).deleteById(any());
    }
}